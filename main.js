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
  const lang = obj?.lang ?? ''
  const filter = Array.isArray(device) ? Array.from(device).filter(o => {
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
    let match = true
    // 当只指定了异常时，只筛选异常相关
    if (id.length === 0 && name.length === 0 && os.length === 0 && label1.length === 0 && label2.length === 0
      && !assign_online && !assign_offline
      && (assign_error || assign_hardware || assign_software || assign_battery || assign_peripheral || assign_security)) {
      if (assign_error) match = match && match_error
      if (assign_hardware) match = match && match_hardware
      if (assign_software) match = match && match_software
      if (assign_battery) match = match && match_battery
      if (assign_peripheral) match = match && match_peripheral
      if (assign_security) match = match && match_security
      return match
    }
    // 当只指定了在线或者离线时，只筛选status
    if (id.length === 0 && name.length === 0 && os.length === 0 && label1.length === 0 && label2.length === 0
      && (assign_online || assign_offline)) {
      match = match_online || match_offline
    }
    // 当没有指定具体栏位时，只要满足一个条件就行
    else if (!assign_id && !assign_name && !assign_os && !assign_label1 && !assign_label2) {
      match = (match_id || match_name || match_os || match_label1 || match_label2) && match_status
    }
    // 当有指定具体栏位时，需要满足所有指定栏位
    else {
      match = match && match_status
      if (assign_id) match = match && match_id
      if (assign_name) match = match && match_name
      if (assign_os) match = match && match_os
      if (assign_label1 && !assign_label2) match = match && match_label1
      if (!assign_label1 && assign_label2) match = match && match_label2
      if (assign_label1 && assign_label2) match = match && (match_label2 || match_label1)
    }
    if (assign_error) match = match && match_error
    if (assign_hardware) match = match && match_hardware
    if (assign_software) match = match && match_software
    if (assign_battery) match = match && match_battery
    if (assign_peripheral) match = match && match_peripheral
    if (assign_security) match = match && match_security
    return match
  }) : []
  const result = filter.map(o => {
    return {
      id: o.id,
      name: o.nm,
      os: o.os,
      timezone: o.tz,
    }
  })
  return {
    result: JSON.stringify({
      type: 'find_device',
      data: {
        assign_device,
        device: result,
        lang,
      }
    }),
    device: JSON.stringify(result),
  }
}

function timeStringToCron(timeStr) {
  // 分割日期部分和时间部分
  const [datePart, timePart] = timeStr.split(' ');
  if (!datePart || !timePart) {
    throw new Error('时间字符串格式错误，应为 "YYYY/MM/DD HH:mm:ss"');
  }
  // 分割出年、月、日
  const [year, month, day] = datePart.split('/');
  // 分割出时、分、秒
  const [hour, minute, second] = timePart.split(':');

  // 构造 Cron 表达式，Quartz 格式为 "ss mm HH dd MM ? YYYY-YYYY"
  return `${Number(second)} ${Number(minute)} ${Number(hour)} ${Number(day)} ${Number(month)} ? ${year}-${year}`;
}

function main({assign_task, timezone}) {
  const res = JSON.parse(assign_task)
  let url = ''
  let request = ''
  switch (res.type) {
    case 'control_task':
      const scheduleType = res.data.schedule.scheduleType
      const control_code = res.data.actionCode
      let parameter = {}
      if (control_code === '90003') {
        if (!!res.data.audioMute) {
          parameter = {
            audioMute: true,
          }
        } else {
          parameter = {
            volume: res.data.value,
          }
        }
      } else if (control_code === '90004') {
        parameter = {
          brightness: res.data.value,
        }
      }
      const targetDevices = Array.isArray(res?.data?.targetDevices) ? Array.from(res.data.targetDevices).map(o => {
        return {
          deviceId: o.id,
          deviceOs: o.os,
          timezone: o.timezone,
        };
      }) : [];
      switch (scheduleType) {
        case 'NONE':
          url = '/walle/ai/onceTask/addCommonImmediateTask'
          request = JSON.stringify({
            actionCode: control_code,
            parameter,
            targetDevices,
          })
          break
        case 'ONLINE':
          url = '/walle/ai/onceTask/addCommonOnlineTask'
          request = JSON.stringify({
            actionCode: control_code,
            parameter,
            targetDevices,
          })
          break
        case 'CRON ONCE':
          url = '/walle/ai/onceTask/addCommonCronTask'
          request = JSON.stringify({
            actionCode: control_code,
            parameter,
            targetDevices,
            userTimeZone: timezone,
            timezoneLocalEnabled: !!res.data?.schedule?.timezoneLocalEnabled,
            scheduleCron: timeStringToCron(res.data?.schedule?.scheduleCron)
          })
          break
      }
      break
  }
  return {
    request,
    url,
  }
}

function main({assign_task, body}) {
  const res = JSON.parse(assign_task)
  const result = JSON.parse(body)
  return {
    result: JSON.stringify({
      ...res,
      result,
    })
  }
}


function main({text, device, assign_device}) {
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
  const id = Array.isArray(obj?.targetDevices?.id) ? Array.from(obj.targetDevices.id) : []
  const name = Array.isArray(obj?.targetDevices?.name) ? Array.from(obj.targetDevices.name) : []
  const os = Array.isArray(obj?.targetDevices?.os) ? Array.from(obj.targetDevices.os).map(s => String(s).toLowerCase()) : []
  const label1 = Array.isArray(obj?.targetDevices?.label1) ? Array.from(obj.targetDevices.label1) : []
  const label2 = Array.isArray(obj?.targetDevices?.label2) ? Array.from(obj.targetDevices.label2) : []
  const assign_id = !!obj?.targetDevices?.assign_id
  const assign_name = !!obj?.targetDevices?.assign_name
  const assign_os = !!obj?.targetDevices?.assign_os
  const assign_label1 = !!obj?.targetDevices?.assign_label1
  const assign_label2 = !!obj?.targetDevices?.assign_label2
  const assign_online = !!obj?.targetDevices?.assign_online
  const assign_offline = !!obj?.targetDevices?.assign_offline
  const is_device = !!obj?.targetDevices?.assign_device
  const assign_error = !!obj?.targetDevices?.assign_error
  const assign_hardware = !!obj?.targetDevices?.assign_hardware
  const assign_software = !!obj?.targetDevices?.assign_software
  const assign_battery = !!obj?.targetDevices?.assign_battery
  const assign_peripheral = !!obj?.targetDevices?.assign_peripheral
  const assign_security = !!obj?.targetDevices?.assign_security
  let filter
  if (is_device && !!assign_device) {
    const arr = JSON.parse(assign_device)
    filter = Array.isArray(arr) ? Array.from(arr) : []
  } else {
    filter = Array.isArray(device) ? Array.from(device).filter(o => {
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
      let match = true
      // 当只指定了异常时，只筛选异常相关
      if (id.length === 0 && name.length === 0 && os.length === 0 && label1.length === 0 && label2.length === 0
        && !assign_online && !assign_offline
        && (assign_error || assign_hardware || assign_software || assign_battery || assign_peripheral || assign_security)) {
        if (assign_error) match = match && match_error
        if (assign_hardware) match = match && match_hardware
        if (assign_software) match = match && match_software
        if (assign_battery) match = match && match_battery
        if (assign_peripheral) match = match && match_peripheral
        if (assign_security) match = match && match_security
        return match
      }
      // 当只指定了在线或者离线时，只筛选status
      if (id.length === 0 && name.length === 0 && os.length === 0 && label1.length === 0 && label2.length === 0
        && (assign_online || assign_offline)) {
        match = match_online || match_offline
      }
      // 当没有指定具体栏位时，只要满足一个条件就行
      else if (!assign_id && !assign_name && !assign_os && !assign_label1 && !assign_label2) {
        match = (match_id || match_name || match_os || match_label1 || match_label2) && match_status
      }
      // 当有指定具体栏位时，需要满足所有指定栏位
      else {
        match = match && match_status
        if (assign_id) match = match && match_id
        if (assign_name) match = match && match_name
        if (assign_os) match = match && match_os
        if (assign_label1 && !assign_label2) match = match && match_label1
        if (!assign_label1 && assign_label2) match = match && match_label2
        if (assign_label1 && assign_label2) match = match && (match_label2 || match_label1)
      }
      if (assign_error) match = match && match_error
      if (assign_hardware) match = match && match_hardware
      if (assign_software) match = match && match_software
      if (assign_battery) match = match && match_battery
      if (assign_peripheral) match = match && match_peripheral
      if (assign_security) match = match && match_security
      return match
    }).map(o => {
      return {
        id: o.id,
        name: o.nm,
        os: o.os,
        timezone: o.tz,
      }
    }) : []
  }

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


function main({text}) {
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
  return {
    execute: !!obj?.['judgment'] && obj?.['judgment'] !== 'false' ? 1 : 0
  }
}

function handleLLM(text) {
  const regex = /```json([\s\S]*?)```/
  const _res = text.replaceAll(/<think>[\s\S]*?<\/think>/g, '')
  const match = _res.match(regex);
  const res = !!match ? match[1].trim() : _res
  const str = res.replaceAll(/\/\/.*$/gm, '').replaceAll(/\/\*[\s\S]*?\*\//g, '')
  let obj
  try {
    obj = JSON.parse(str)
  } catch (e) {
    obj = {}
  }
  return obj
}
function main({text, device}) {
  device = JSON.parse(device)
  const obj = handleLLM(text)
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
  const lang = obj?.lang ?? ''
  const filter = Array.isArray(device) ? Array.from(device).filter(o => {
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
    let match = true
    // 当只指定了异常时，只筛选异常相关
    if (id.length === 0 && name.length === 0 && os.length === 0 && label1.length === 0 && label2.length === 0
      && !assign_online && !assign_offline
      && (assign_error || assign_hardware || assign_software || assign_battery || assign_peripheral || assign_security)) {
      if (assign_error) match = match && match_error
      if (assign_hardware) match = match && match_hardware
      if (assign_software) match = match && match_software
      if (assign_battery) match = match && match_battery
      if (assign_peripheral) match = match && match_peripheral
      if (assign_security) match = match && match_security
      return match
    }
    // 当只指定了在线或者离线时，只筛选status
    if (id.length === 0 && name.length === 0 && os.length === 0 && label1.length === 0 && label2.length === 0
      && (assign_online || assign_offline)) {
      match = match_online || match_offline
    }
    // 当没有指定具体栏位时，只要满足一个条件就行
    else if (!assign_id && !assign_name && !assign_os && !assign_label1 && !assign_label2) {
      match = (match_id || match_name || match_os || match_label1 || match_label2) && match_status
    }
    // 当有指定具体栏位时，需要满足所有指定栏位
    else {
      match = match && match_status
      if (assign_id) match = match && match_id
      if (assign_name) match = match && match_name
      if (assign_os) match = match && match_os
      if (assign_label1 && !assign_label2) match = match && match_label1
      if (!assign_label1 && assign_label2) match = match && match_label2
      if (assign_label1 && assign_label2) match = match && (match_label2 || match_label1)
    }
    if (assign_error) match = match && match_error
    if (assign_hardware) match = match && match_hardware
    if (assign_software) match = match && match_software
    if (assign_battery) match = match && match_battery
    if (assign_peripheral) match = match && match_peripheral
    if (assign_security) match = match && match_security
    return match
  }) : []
  const result = filter.map(o => {
    return {
      id: o.id,
      name: o.nm,
      os: o.os,
      timezone: o.tz,
    }
  })
  return {
    result: JSON.stringify({
      type: 'find_device',
      data: {
        assign_device,
        device: result,
        lang,
      }
    }),
    device: JSON.stringify(result),
  }
}


