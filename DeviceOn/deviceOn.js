/**
 * 处理设备筛选
 */
function main({body}) {
  const obj = JSON.parse(body)
  const outputs = obj?.data?.outputs ?? {}
  return {
    result: outputs?.result ?? '',
    content: outputs?.content ?? '',
    type: outputs?.type ?? '',
    is_remote: Number(outputs?.is_remote) ?? 0,
    is_reboot: Number(outputs?.is_reboot) ?? 0,
    is_find_device: Number(outputs?.is_find_device) ?? 0,
  }
}


function main({}) {
  return {
    request: JSON.stringify({
      "inputs": {
        "device": "[{\"id\":\"C4:00:AD:DE:07:76\",\"nm\":\"PPC-300\",\"os\":\"android\",\"ip\":\"172.21.84.152\",\"l1\":\"工程设备\",\"l2\":\"Android\",\"st\":\"0\",\"tz\":\"UTC\",\"hw\":0,\"sw\":0,\"bt\":0,\"pp\":0,\"sc\":0},{\"id\":\"C4:00:AD:E4:DE:47\",\"nm\":\"PPC-300\",\"os\":\"android\",\"ip\":\"172.21.84.37\",\"l1\":null,\"l2\":null,\"st\":\"0\",\"tz\":\"UTC\",\"hw\":0,\"sw\":0,\"bt\":0,\"pp\":0,\"sc\":0},{\"id\":\"A0:19:B2:D1:94:9F\",\"nm\":\"rk3288-An1-AKTC1\",\"os\":\"android\",\"ip\":\"192.168.50.73\",\"l1\":\"工程设备\",\"l2\":\"Android\",\"st\":\"0\",\"tz\":\"UTC+08:00\",\"hw\":0,\"sw\":0,\"bt\":0,\"pp\":0,\"sc\":0},{\"id\":\"7C:D3:0A:41:A4:F2\",\"nm\":\"AIM75-WIFI\",\"os\":\"android\",\"ip\":\"192.168.13.131\",\"l1\":\"工程设备\",\"l2\":\"Android\",\"st\":\"0\",\"tz\":\"UTC+08:00\",\"hw\":0,\"sw\":0,\"bt\":0,\"pp\":0,\"sc\":0},{\"id\":\"02:00:00:00:00:00\",\"nm\":\"Android SDK built for x86_64\",\"os\":\"android\",\"ip\":\"10.0.2.16\",\"l1\":null,\"l2\":null,\"st\":\"0\",\"tz\":\"UTC\",\"hw\":0,\"sw\":0,\"bt\":0,\"pp\":0,\"sc\":0},{\"id\":\"74:FE:48:7E:C3:30\",\"nm\":\"(Mark) DLT-V7310AP\",\"os\":\"android\",\"ip\":\"172.22.132.91\",\"l1\":\"Signage\",\"l2\":\"Android\",\"st\":\"0\",\"tz\":\"UTC\",\"hw\":0,\"sw\":0,\"bt\":0,\"pp\":0,\"sc\":0},{\"id\":\"B8:13:32:B3:F9:8A\",\"nm\":\"rk3568_s\",\"os\":\"android\",\"ip\":\"172.21.73.70\",\"l1\":null,\"l2\":null,\"st\":\"0\",\"tz\":\"UTC+08:00\",\"hw\":0,\"sw\":0,\"bt\":0,\"pp\":0,\"sc\":0},{\"id\":\"08:00:27:3C:56:71\",\"nm\":\"qa\",\"os\":\"linux\",\"ip\":\"172.21.73.157\",\"l1\":null,\"l2\":\"Linux\",\"st\":\"0\",\"tz\":\"UTC+08:00\",\"hw\":0,\"sw\":0,\"bt\":0,\"pp\":0,\"sc\":0},{\"id\":\"CC:82:7F:5F:A0:9D\",\"nm\":\"PPC-300\",\"os\":\"android\",\"ip\":\"172.21.84.110\",\"l1\":null,\"l2\":null,\"st\":\"0\",\"tz\":\"UTC\",\"hw\":0,\"sw\":0,\"bt\":0,\"pp\":0,\"sc\":0},{\"id\":\"52:54:00:12:34:56\",\"nm\":\"Android SDK built for x86_64\",\"os\":\"android\",\"ip\":\"10.0.2.16\",\"l1\":null,\"l2\":null,\"st\":\"0\",\"tz\":\"UTC\",\"hw\":0,\"sw\":0,\"bt\":0,\"pp\":0,\"sc\":0},{\"id\":\"CE:F7:D7:DC:C8:6B\",\"nm\":\"rk3399_Android12\",\"os\":\"android\",\"ip\":\"172.21.73.60\",\"l1\":\"工程设备\",\"l2\":\"Android\",\"st\":\"0\",\"tz\":\"UTC+08:00\",\"hw\":0,\"sw\":0,\"bt\":0,\"pp\":0,\"sc\":0},{\"id\":\"00:0A:F5:E5:A3:04\",\"nm\":\"AIM-78_WIFI\",\"os\":\"android\",\"ip\":\"192.168.13.107\",\"l1\":null,\"l2\":null,\"st\":\"1\",\"tz\":\"UTC+08:00\",\"hw\":0,\"sw\":0,\"bt\":1,\"pp\":0,\"sc\":0},{\"id\":\"02:00:00:44:55:66\",\"nm\":\"Android SDK built\",\"os\":\"android\",\"ip\":\"192.168.232.2\",\"l1\":null,\"l2\":null,\"st\":\"0\",\"tz\":\"UTC+08:00\",\"hw\":0,\"sw\":0,\"bt\":0,\"pp\":0,\"sc\":0},{\"id\":\"A0:19:B2:D1:F5:2D\",\"nm\":\"rk3568_s\",\"os\":\"android\",\"ip\":\"192.168.61.55\",\"l1\":\"Signage\",\"l2\":\"Android\",\"st\":\"1\",\"tz\":\"UTC+08:00\",\"hw\":0,\"sw\":1,\"bt\":0,\"pp\":0,\"sc\":0},{\"id\":\"CC:82:7F:35:A4:22\",\"nm\":\"TPC_1XX\",\"os\":\"android\",\"ip\":\"172.21.73.60\",\"l1\":\"工程设备\",\"l2\":\"Android\",\"st\":\"0\",\"tz\":\"UTC\",\"hw\":0,\"sw\":0,\"bt\":0,\"pp\":0,\"sc\":0},{\"id\":\"C4:00:AD:50:5F:33\",\"nm\":\"PPC-3211W-P75A\",\"os\":\"windows\",\"ip\":\"172.21.73.143\",\"l1\":null,\"l2\":null,\"st\":\"1\",\"tz\":\"UTC+08:00\",\"hw\":0,\"sw\":0,\"bt\":2,\"pp\":0,\"sc\":0},{\"id\":\"DA:8B:FC:DF:3A:37\",\"nm\":\"Rockchip\",\"os\":\"android\",\"ip\":\"172.21.84.201\",\"l1\":null,\"l2\":null,\"st\":\"0\",\"tz\":\"UTC+08:00\",\"hw\":0,\"sw\":0,\"bt\":0,\"pp\":0,\"sc\":0},{\"id\":\"C4:00:AD:87:C4:6B\",\"nm\":\"昆山测试windows\",\"os\":\"windows\",\"ip\":\"172.21.169.20\",\"l1\":null,\"l2\":null,\"st\":\"1\",\"tz\":\"UTC+08:00\",\"hw\":0,\"sw\":0,\"bt\":0,\"pp\":0,\"sc\":0},{\"id\":\"74:FE:48:7E:C3:0D\",\"nm\":\"DLT-V7310AP\",\"os\":\"android\",\"ip\":\"192.168.13.113\",\"l1\":null,\"l2\":null,\"st\":\"0\",\"tz\":\"UTC+08:00\",\"hw\":0,\"sw\":0,\"bt\":0,\"pp\":0,\"sc\":0},{\"id\":\"54:B2:03:9D:9D:1E\",\"nm\":\"deviceon-ubuntu\",\"os\":\"linux\",\"ip\":\"172.21.169.26\",\"l1\":\"工程设备\",\"l2\":\"Linux\",\"st\":\"0\",\"tz\":\"UTC+08:00\",\"hw\":0,\"sw\":0,\"bt\":0,\"pp\":0,\"sc\":0},{\"id\":\"08:00:27:FD:B8:50\",\"nm\":\"qa-VirtualBox\",\"os\":\"linux\",\"ip\":\"172.21.73.196\",\"l1\":null,\"l2\":null,\"st\":\"0\",\"tz\":\"UTC+08:00\",\"hw\":0,\"sw\":0,\"bt\":0,\"pp\":0,\"sc\":0},{\"id\":\"74:FE:48:7E:C3:7B\",\"nm\":\"DLT-V7312AP+\",\"os\":\"android\",\"ip\":\"172.21.84.48\",\"l1\":null,\"l2\":null,\"st\":\"0\",\"tz\":\"UTC+08:00\",\"hw\":0,\"sw\":0,\"bt\":0,\"pp\":0,\"sc\":0},{\"id\":\"7C:D3:0A:41:A5:3E\",\"nm\":\"AIM75-WIFI\",\"os\":\"android\",\"ip\":\"192.168.13.107\",\"l1\":null,\"l2\":null,\"st\":\"0\",\"tz\":\"UTC-04:00\",\"hw\":0,\"sw\":0,\"bt\":0,\"pp\":0,\"sc\":0}]",
        "id": "[\n  \"C4:00:AD:DE:07:76\",\n  \"C4:00:AD:E4:DE:47\",\n  \"A0:19:B2:D1:94:9F\",\n  \"7C:D3:0A:41:A4:F2\",\n  \"02:00:00:00:00:00\",\n  \"74:FE:48:7E:C3:30\",\n  \"B8:13:32:B3:F9:8A\",\n  \"08:00:27:3C:56:71\",\n  \"CC:82:7F:5F:A0:9D\",\n  \"52:54:00:12:34:56\",\n  \"CE:F7:D7:DC:C8:6B\",\n  \"00:0A:F5:E5:A3:04\",\n  \"02:00:00:44:55:66\",\n  \"A0:19:B2:D1:F5:2D\",\n  \"CC:82:7F:35:A4:22\",\n  \"C4:00:AD:50:5F:33\",\n  \"DA:8B:FC:DF:3A:37\",\n  \"C4:00:AD:87:C4:6B\",\n  \"74:FE:48:7E:C3:0D\",\n  \"54:B2:03:9D:9D:1E\",\n  \"08:00:27:FD:B8:50\",\n  \"74:FE:48:7E:C3:7B\",\n  \"7C:D3:0A:41:A5:3E\"\n]",
        "ip": "[\n  \"172.21.84.152\",\n  \"172.21.84.37\",\n  \"192.168.50.73\",\n  \"192.168.13.131\",\n  \"10.0.2.16\",\n  \"172.22.132.91\",\n  \"172.21.73.70\",\n  \"172.21.73.157\",\n  \"172.21.84.110\",\n  \"172.21.73.60\",\n  \"192.168.13.107\",\n  \"192.168.232.2\",\n  \"192.168.61.55\",\n  \"172.21.73.143\",\n  \"172.21.84.201\",\n  \"172.21.169.20\",\n  \"192.168.13.113\",\n  \"172.21.169.26\",\n  \"172.21.73.196\",\n  \"172.21.84.48\"\n]",
        "label1": "[\n  \"工程设备\",\n  \"Signage\"\n]",
        "label2": "[\n  \"Android\",\n  \"Linux\"\n]",
        "name": "[\n  \"PPC-300\",\n  \"rk3288-An1-AKTC1\",\n  \"AIM75-WIFI\",\n  \"Android SDK built for x86_64\",\n  \"(Mark) DLT-V7310AP\",\n  \"rk3568_s\",\n  \"qa\",\n  \"rk3399_Android12\",\n  \"AIM-78_WIFI\",\n  \"Android SDK built\",\n  \"TPC_1XX\",\n  \"PPC-3211W-P75A\",\n  \"Rockchip\",\n  \"昆山测试windows\",\n  \"DLT-V7310AP\",\n  \"deviceon-ubuntu\",\n  \"qa-VirtualBox\",\n  \"DLT-V7312AP+\"\n]",
        "question": "列出在线设备",
        "type": "",
        "content": "",
        "timezone": "UTC+08: 00",
        "api": "https://dev-apps.deviceon-iservice.com/api",
        "token": "eyJhbGciOiJIUzUxMiJ9.eyJ1c2VyX2lkIjoxODksInVzZXJfa2V5IjoiNjI1ZDg0ZGQtNTExZS00ZTQxLWIzMTgtYTE1NWY2NjhhOTg3IiwidXNlcm5hbWUiOiJuaWVjaGFvMTU4QHFxLmNvbSJ9._tEj2UqYUxefly9cQvaWO4_UKu8LwYMZbTcIZHWlEjv46l886YX5ers9ah_BFnUtNIgJdZzwddpkXnhaGztNbQ"
      },
      "response_mode": "blocking",
      "user": "deviceOn"
    })
  }
}
