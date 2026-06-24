using System;
using System.Diagnostics;
using System.IO;
using System.Runtime.InteropServices;

// LyaCode launcher (winexe). Garante um console com TTY real para o cli.mjs
// interativo e um working directory gravavel. Grava um log leve de boot em
// %USERPROFILE%\LyaCode\launch.log (sem redirecionar o stdio do node, para
// nao quebrar a UI interativa).
class LyaCodeLauncher {
    const int ATTACH_PARENT_PROCESS = -1;
    [DllImport("kernel32.dll", SetLastError = true)] static extern bool AllocConsole();
    [DllImport("kernel32.dll", SetLastError = true)] static extern bool AttachConsole(int pid);
    [DllImport("kernel32.dll")] static extern IntPtr GetConsoleWindow();

    static string logPath;
    static void L(string m) {
        try { File.AppendAllText(logPath, DateTime.Now.ToString("HH:mm:ss.fff") + " " + m + "\r\n"); } catch { }
    }

    static int Main(string[] args) {
        string home   = Environment.GetFolderPath(Environment.SpecialFolder.UserProfile);
        string lyaDir = Path.Combine(home, "LyaCode");
        try { Directory.CreateDirectory(lyaDir); } catch { lyaDir = home; }
        logPath = Path.Combine(lyaDir, "launch.log");
        try { File.WriteAllText(logPath, "=== LyaCode launch " + DateTime.Now + " ===\r\n"); } catch { }

        // Garante console com TTY: AttachConsole quando vem de um terminal (alias);
        // AllocConsole quando vem do tile (app GUI, sem console).
        if (GetConsoleWindow() == IntPtr.Zero) {
            if (!AttachConsole(ATTACH_PARENT_PROCESS)) AllocConsole();
        }
        L("console=" + GetConsoleWindow());

        string dir     = AppContext.BaseDirectory;
        string nodeExe = Path.Combine(dir, "node.exe");
        string cliMjs  = Path.Combine(dir, "cli.mjs");

        if (!File.Exists(nodeExe) || !File.Exists(cliMjs)) {
            L("FATAL: runtime ausente node=" + File.Exists(nodeExe) + " cli=" + File.Exists(cliMjs));
            Console.Error.WriteLine("Lya Code: runtime nao encontrado no pacote.");
            Pause();
            return 1;
        }

        var argList = new System.Collections.Generic.List<string>();
        argList.Add("\"" + cliMjs.Replace("\"", "\\\"") + "\"");
        foreach (string a in args) argList.Add("\"" + a.Replace("\"", "\\\"") + "\"");

        var psi = new ProcessStartInfo {
            FileName         = nodeExe,
            Arguments        = string.Join(" ", argList),
            UseShellExecute  = false,
            WorkingDirectory = lyaDir,
        };

        try {
            L("starting node...");
            var p = Process.Start(psi);
            p.WaitForExit();
            L("node exited code=" + p.ExitCode);
            return p.ExitCode;
        } catch (Exception ex) {
            L("EXCEPTION: " + ex.Message);
            Console.Error.WriteLine("Lya Code: falha ao iniciar — " + ex.Message);
            Pause();
            return 1;
        }
    }

    static void Pause() {
        try { Console.Error.WriteLine("Pressione Enter para sair..."); Console.In.ReadLine(); } catch { }
    }
}
