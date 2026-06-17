document.addEventListener('DOMContentLoaded', () => {
    const API = "https://api.2237yh.net/api/status";

    const widget = document.getElementById('server-status-widget');
    if (!widget) {
        return;
    }

    const cpuBar = document.getElementById("cpuBar");
    const cpuValue = document.getElementById("cpuValue");
    const ramBar = document.getElementById("ramBar");
    const ramValue = document.getElementById("ramValue");
    const netBar = document.getElementById("netBar");
    const netValue = document.getElementById("netValue");
    const diskIoBar = document.getElementById("diskIoBar");
    const diskIoValue = document.getElementById("diskIoValue");

    async function updateStatus() {
        try {
            const res = await fetch(API);
            if (!res.ok) {
                throw new Error(`HTTP error! status: ${res.status}`);
            }
            const data = await res.json();

            const cpu = parseFloat(data.cpu);
            if(cpuBar) cpuBar.style.width = cpu + "%";
            if(cpuValue) cpuValue.textContent = `${cpu.toFixed(1)}%`;

            const ram = parseFloat(data.ram);
            if(ramBar) ramBar.style.width = ram + "%";
            if(ramValue) ramValue.textContent = `${ram.toFixed(1)}%`;

            const netRx = parseFloat(data.netRx) || 0;
            const netTx = parseFloat(data.netTx) || 0;
            const total = netRx + netTx;
            const NET_MAX = 1024;
            const percent = Math.min(total / NET_MAX * 100, 100);
            if(netBar) netBar.style.width = percent + "%";
            if(netValue) netValue.textContent = `↓${netRx.toFixed(1)} ↑${netTx.toFixed(1)} KB/s`;

            const diskRead = parseFloat(data.diskRead || 0);
            const diskWrite = parseFloat(data.diskWrite || 0);
            const diskTotal = diskRead + diskWrite;
            if(diskIoBar) diskIoBar.style.width = Math.min(diskTotal / 50000 * 100, 100) + "%";
            if(diskIoValue) diskIoValue.textContent = `↓${diskRead.toFixed(1)} ↑${diskWrite.toFixed(1)} KB/s`;

        } catch (err) {
            console.error("Error fetching status:", err);
            if(cpuValue) cpuValue.textContent = "Error";
            if(ramValue) ramValue.textContent = "Error";
            if(netValue) netValue.textContent = "Error";
            if(cpuBar) cpuBar.style.width = "0%";
            if(ramBar) ramBar.style.width = "0%";
            if(netBar) netBar.style.width = "0%";
        }
    }

    setInterval(updateStatus, 1000);
    updateStatus();
});
