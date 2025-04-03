/**
 * 处理设备筛选
 */
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
function main({text, device, type, content}) {
  device = JSON.parse(device)
  const list = Array.isArray(device) ? Array.from(device) : []
  const by_id = {}
  list.forEach(o => {
    by_id[o.id] = o
  })
  const obj = handleLLM(text)
  const is_device = !!obj?.assign_device
  const assign_index = Number(obj?.assign_index)
  const assign_last = !!obj?.assign_last
  const id = Array.isArray(obj?.id) ? Array.from(obj.id) : []
  const name = Array.isArray(obj?.name) ? Array.from(obj.name) : []
  const ip = Array.isArray(obj?.ip) ? Array.from(obj.ip) : []
  const os = Array.isArray(obj?.os) ? Array.from(obj.os).map(s => String(s).toLowerCase()) : []
  const label1 = Array.isArray(obj?.label1) ? Array.from(obj.label1) : []
  const label2 = Array.isArray(obj?.label2) ? Array.from(obj.label2) : []
  const assign_id = !!obj?.assign_id
  const assign_name = !!obj?.assign_name
  const assign_ip = !!obj?.assign_ip
  const assign_os = !!obj?.assign_os
  const assign_label1 = !!obj?.assign_label1
  const assign_label2 = !!obj?.assign_label2
  const assign_online = !!obj?.assign_online
  const assign_offline = !!obj?.assign_offline
  const assign_error = !!obj?.assign_error
  const assign_hardware = !!obj?.assign_hardware
  const assign_software = !!obj?.assign_software
  const assign_battery = !!obj?.assign_battery
  const assign_peripheral = !!obj?.assign_peripheral
  const assign_security = !!obj?.assign_security
  const lang = obj?.lang ?? ''
  let filter_id = [], filter_device = list.map(o => o)
  const find_device = !!content && type === 'find_device'
  if (find_device) {
    const obj = JSON.parse(content)
    filter_device = Array.isArray(obj?.data?.targetDevices) ? Array.from(obj?.data?.targetDevices).map(o => by_id[o.id]) : []
    if (!Number.isNaN(assign_index) && assign_index > 0 && assign_index <= filter_device.length) {
      let index = assign_index - 1
      if (assign_last) index = filter_device.length - 1 - index
      filter_id = [filter_device[index].id]
    }
  }
  if (filter_id.length === 0) {
    filter_id = filter_device.filter(o => {
      const match_id = id.includes(o.id)
      const match_name = name.includes(o.nm)
      const match_ip = ip.includes(o.ip)
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
      if (id.length === 0 && name.length === 0 && ip.length === 0 && os.length === 0 && label1.length === 0 && label2.length === 0
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
      if (id.length === 0 && name.length === 0 && ip.length === 0 && os.length === 0 && label1.length === 0 && label2.length === 0
        && (assign_online || assign_offline)) {
        match = match_online || match_offline
      }
      // 当没有指定具体栏位时，只要满足一个条件就行
      else if (!assign_id && !assign_name && !assign_ip && !assign_os && !assign_label1 && !assign_label2) {
        match = (match_id || match_name || match_ip || match_os || match_label1 || match_label2) && match_status
      }
      // 当有指定具体栏位时，需要满足所有指定栏位
      else {
        match = match && match_status
        if (assign_id) match = match && match_id
        if (assign_name) match = match && match_name
        if (assign_ip) match = match && match_ip
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
    }).map(o => o.id)
  }
  const filter = filter_id.map(id => {
    const o = by_id[id]
    return {
      id: o.id,
      name: o.nm,
      os: o.os,
      timezone: o.tz,
      ip: o.ip,
      status: o.st,
    }
  })
  let result = JSON.stringify({
    type: 'find_device',
    data: {
      assign_device: is_device || find_device,
      targetDevices: filter,
      lang,
    }
  })
  let res = filter.length > 0 ? result : ''
  const is_find_device = assign_index !== -1 || id.length > 0 || name.length > 0 || ip.length > 0
  || os.length > 0 || label1.length > 0 || label2.length > 0 || assign_online || assign_offline || assign_error
  || assign_hardware || assign_software || assign_battery || assign_peripheral || assign_security ? 1 : 0
  return {
    result,
    content: res,
    type: !!res ? 'find_device' : '',
    is_find_device,
  }
}


/**
 * 处理新增任务
 */
function main({body, is_remote, is_reboot, is_find_device}) {
  const obj = JSON.parse(body)
  const outputs = obj?.data?.outputs ?? {}
  return {
    result: outputs?.result ?? '',
    content: outputs?.content ?? '',
    type: outputs?.type ?? '',
    is_remote,
    is_reboot,
    is_find_device,
  }
}
