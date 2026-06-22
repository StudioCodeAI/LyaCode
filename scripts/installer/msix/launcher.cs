using System;
using System.Diagnostics;
using System.IO;
using System.Reflection;
class LyaCodeSetup {
    static int Main(string[] args) {
        string dir = Path.GetDirectoryName(Assembly.GetExecutingAssembly().Location);
        string ps1 = Path.Combine(dir, "install.ps1");
        string tgz = Path.Combine(dir, "studiocodeai-lyacode-1.1.1.tgz");
        var psi = new ProcessStartInfo {
            FileName = "powershell.exe",
            Arguments = String.Format("-NoProfile -ExecutionPolicy Bypass -File \"{0}\" -Tarball \"{1}\"", ps1, tgz),
            UseShellExecute = true
        };
        var p = Process.Start(psi);
        p.WaitForExit();
        return p.ExitCode;
    }
}
