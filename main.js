function convertToTimeZone(timezone) {
  // 检查格式是否以 "UTC" 开头
  if (!timezone.startsWith("UTC")) {
    throw new Error("时区格式必须以 'UTC' 开头");
  }
  // 获取符号和小时、分钟部分
  const sign = timezone[3]; // '+' 或 '-'
  if (sign !== '+' && sign !== '-') {
    throw new Error("无效的时区格式");
  }
  const hourStr = timezone.substr(4, 2);
  const minuteStr = timezone.substr(7, 2);
  const offsetHours = parseInt(hourStr, 10);
  const offsetMinutes = parseInt(minuteStr, 10);
  // 计算总偏移分钟数（正值代表比 UTC 晚，负值代表比 UTC 早）
  let totalOffset = offsetHours * 60 + offsetMinutes;
  if (sign === '-') {
    totalOffset = -totalOffset;
  }
  // 当前的 UTC 毫秒数（Date.now() 返回的是自1970年1月1日 UTC 以来的毫秒数）
  const nowMs = Date.now();
  // 目标时区的毫秒数 = 当前 UTC 毫秒数 + 时区偏移分钟数转换为毫秒
  const targetMs = nowMs + totalOffset * 60000;
  const targetDate = new Date(targetMs);
  // 使用 getUTC* 方法来提取目标时区的各部分
  const year = targetDate.getUTCFullYear();
  const month = String(targetDate.getUTCMonth() + 1).padStart(2, '0'); // 月份从 0 开始
  const day = String(targetDate.getUTCDate()).padStart(2, '0');
  const hours = String(targetDate.getUTCHours()).padStart(2, '0');
  const minutes = String(targetDate.getUTCMinutes()).padStart(2, '0');
  const seconds = String(targetDate.getUTCSeconds()).padStart(2, '0');

  return `${year}/${month}/${day} ${hours}:${minutes}:${seconds}`;
}
function main({body, timezone}) {
  const res = JSON.parse(body)
  const device = Array.isArray(res?.rows) ? Array.from(res.rows).map(o => {
    return {
      id: o.deviceId,
      nm: o.deviceName,
      os: o.deviceOs,
      l1: o.labelDeviceName1,
      l2: o.labelDeviceName2,
      st: o.onlineStatus,
      tz: o.timezone,
      hw: o.hardwareError,
      sw: o.softwareError,
      bt: o.batteryError,
      pp: o.peripheralsError,
      sc: o.securityError,
    }
  }) : []
  const id = device.map(o => o.id)
  const name = Array.from(new Set(device.map(o => o.nm)))
  const label1 = Array.from(new Set(device.map(o => o.l1).filter(o => !!o)))
  const label2 = Array.from(new Set(device.map(o => o.l2).filter(o => !!o)))
  const date = convertToTimeZone(timezone);
  return {
    device: JSON.stringify(device),
    id: JSON.stringify(id),
    name: JSON.stringify(name),
    label1: JSON.stringify(label1),
    label2: JSON.stringify(label2),
    date,
  }
}


function main({text, device}) {
  device = JSON.parse(device)
  const regex = /```json([\s\S]*?)```/;
  const _res = text.replaceAll(/<think>[\s\S]*?<\/think>/g, '')
  const match = _res.match(regex);
  const res = !!match ? match[1].trim() : _res
  let obj
  try {
    obj = JSON.parse(res)
  } catch (e) {
    obj = {}
  }
  const id = Array.isArray(obj?.id) ? Array.from(obj.id) : []
  const name = Array.isArray(obj?.name) ? Array.from(obj.name) : []
  const os = Array.isArray(obj?.os) ? Array.from(obj.os).map(s => String(s).toLowerCase()) : []
  const label1 = Array.isArray(obj?.label1) ? Array.from(obj.label1) : []
  const label2 = Array.isArray(obj?.label2) ? Array.from(obj.label2) : []
  const assign_id = !!obj?.assign_id
  const assign_name = !!obj?.assign_name
  const assign_os = !!obj?.assign_os
  const assign_label1 = !!obj?.assign_label1
  const assign_label2 = !!obj?.assign_label2
  const assign_online = !!obj?.assign_online
  const assign_offline = !!obj?.assign_offline
  const assign_device = !!obj?.assign_device
  const assign_error = !!obj?.assign_error
  const assign_hardware = !!obj?.assign_hardware
  const assign_software = !!obj?.assign_software
  const assign_battery = !!obj?.assign_battery
  const assign_peripheral = !!obj?.assign_peripheral
  const assign_security = !!obj?.assign_security
  const filter = Array.isArray(device) ? Array.from(device).filter(o => {
    // id筛选：如果文本中提及了id条件，则设备id必须在指定数组中
    if (assign_id) {
      if (!id.includes(o.id)) return false
    }
    if (assign_name) {
      if (!name.includes(o.nm)) return false
    }
    if (assign_os) {
      if (!name.includes(o.nm)) return false
    }
    const match_id = id.includes(o.id)
    const match_name = name.includes(o.nm)
    const match_os = os.includes(o.os)
    const match_label1 = label1.includes(o.l1)
    const match_label2 = label2.includes(o.l2)
    const match_online = assign_online && Number(o.st) === 1
    const match_offline = assign_offline && Number(o.st) === 0
    const match_status = match_online || match_offline || (!assign_online && !assign_offline)
    const hardware = Number(o.hw) > 0
    const software = Number(o.sw) > 0
    const battery = Number(o.bt) > 0
    const peripheral = Number(o.pp) > 0
    const security = Number(o.hw) > 0
    const match_error = assign_error && (hardware || software || battery || peripheral || security)
    const match_hardware = assign_hardware && hardware
    const match_software = assign_software && software
    const match_battery = assign_battery && battery
    const match_peripheral = assign_peripheral && peripheral
    const match_security = assign_security && security
    const assign_err = assign_error || assign_hardware || assign_software || assign_battery
      || assign_peripheral || assign_security
    // 当只指定了在线或者离线时，只筛选status
    if (id.length === 0 && name.length === 0 && os.length === 0 && label1.length === 0 && label2.length === 0
      && !assign_error && !assign_hardware && !assign_software && !assign_battery && !assign_peripheral && !assign_security
      && (assign_online || assign_offline)) {
      return match_online || match_offline
    }
    // 当没有指定具体栏位时，只要满足一个条件就行
    if (!assign_id && !assign_name && !assign_os && !assign_label1 && !assign_label2 && !assign_error
      && !assign_hardware && !assign_software && !assign_battery && !assign_peripheral && !assign_security) {
      return (match_id || match_name || match_os || match_label1 || match_label2) && match_status
    }
    // 当有指定具体栏位时，需要满足所有指定栏位
    let match = true
    if (assign_id) match = match && match_id
    if (assign_name) match = match && match_name
    if (assign_os) match = match && match_os
    if (assign_label1 && !assign_label2) match = match && match_label1
    if (!assign_label1 && assign_label2) match = match && match_label2
    if (assign_label1 && assign_label2) match = match && (match_label2 || match_label1)
    if (assign_error) match = match && match_error
    if (assign_hardware) match = match && match_hardware
    if (assign_software) match = match && match_software
    if (assign_battery) match = match && match_battery
    if (assign_peripheral) match = match && match_peripheral
    if (assign_security) match = match && match_security
    return match && match_status
  }).map(o => {
    return {
      id: o.id,
      name: o.nm,
      os: o.os,
      timezone: o.tz,
    }
  }) : []
  return {
    result: JSON.stringify({
      type: 'control_task',
      data: {
        ...obj,
        targetDevices: filter,
      },
    }),
    device: obj,
  }
}


