/**
 * 处理远程桌面
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
function main({text, device, content, type}) {
  device = JSON.parse(device)
  const list = Array.isArray(device) ? Array.from(device) : []
  const by_id = {}
  list.forEach(o => {
    by_id[o.id] = o
  })
  const obj = handleLLM(text)
  const assign_index = Number(obj?.assign_index)
  const assign_last = !!obj?.assign_last
  const id = Array.isArray(obj?.targetDevices?.id) ? Array.from(obj.targetDevices.id) : []
  const name = Array.isArray(obj?.targetDevices?.name) ? Array.from(obj.targetDevices.name) : []
  const ip = Array.isArray(obj?.targetDevices?.ip) ? Array.from(obj.targetDevices.ip) : []
  const assign_id = !!obj?.targetDevices?.assign_id
  const assign_name = !!obj?.targetDevices?.assign_name
  const assign_ip = !!obj?.targetDevices?.assign_ip
  let filter_id = [], filter_device = list.map(o => o)
  if (!!content && (type === 'find_device' || type === 'remote_desktop')) {
    if (type === 'find_device') {
      const arr = JSON.parse(content)
      filter_device = Array.isArray(arr) ? Array.from(arr).map(o => by_id[o.id]) : []
    }
    if (type === 'remote_desktop') {
      const obj = JSON.parse(content)
      filter_device = Array.isArray(obj?.data?.targetDevices) ? Array.from(obj?.data?.targetDevices).map(o => by_id[o.id]) : []
    }
    if (!Number.isNaN(assign_index) && assign_index > 0 && assign_index <= filter_device.length) {
      let index = assign_index - 1
      if (assign_last) index = filter_device.length - 1 - index
      filter_id = [filter_device[index].id]
    }
    if (filter_device.length === 1 && filter_id.length === 0 && !assign_id && !assign_name && !assign_ip
      && id.length === 0 && name.length === 0 && ip.length === 0) {
      filter_id = [filter_device[0].id]
    }
  }
  if (filter_id.length === 0) {
    filter_id = filter_device.filter(o => {
      const match_id = id.includes(o.id)
      const match_name = name.includes(o.nm)
      const match_ip = ip.includes(o.ip)
      if (!assign_id && !assign_name && !assign_ip) {
        return match_id || match_name || match_ip
      }
      let match = true
      if (assign_id) match = match && match_id
      if (assign_name) match = match && match_name
      if (assign_ip) match = match && match_ip
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
  const result = JSON.stringify({
    type: 'remote_desktop',
    data: {
      ...obj,
      targetDevices: filter,
    },
  })
  const task = filter.length > 1 ? result : ''
  const is_remote = assign_index !== -1 || id.length > 0 || name.length > 0 || ip.length > 0 ? 1 : 0

  return {
    result,
    content: task,
    type: !!task ? 'remote_desktop' : '',
    is_remote,
    device: obj,
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
function main({text, device, remote_desktop}) {
  device = JSON.parse(device)
  const list = Array.isArray(device) ? Array.from(device) : []
  const by_id = {}
  list.forEach(o => {
    by_id[o.id] = o
  })
  const res = JSON.parse(remote_desktop)
  const device_list = Array.isArray(res?.data?.targetDevices) ? Array.from(res?.data?.targetDevices) : []
  const obj = handleLLM(text)
  const assign_index = Number(obj?.assign_index)
  const assign_last = !!obj?.assign_last
  const id = Array.isArray(obj?.targetDevices?.id) ? Array.from(obj.targetDevices.id) : []
  const name = Array.isArray(obj?.targetDevices?.name) ? Array.from(obj.targetDevices.name) : []
  const ip = Array.isArray(obj?.targetDevices?.ip) ? Array.from(obj.targetDevices.ip) : []
  const is_remote = assign_index !== -1 || id.length > 0 || name.length > 0 || ip.length > 0 ? 1 : 0
  const assign_id = !!obj?.targetDevices?.assign_id
  const assign_name = !!obj?.targetDevices?.assign_name
  const assign_ip = !!obj?.targetDevices?.assign_ip
  let filter = []
  if (!Number.isNaN(assign_index) && assign_index > 0 && assign_index <= device_list.length) {
    let index = assign_index - 1
    if (assign_last) index = device_list.length - 1 - index
    filter = [device_list[index]]
  }
  if (id.length > 0 || name.length > 0 || ip.length > 0) {
    filter = device_list.filter(o => {
      const match_id = id.includes(o.id)
      const match_name = name.includes(o.name)
      const match_ip = ip.includes(o.ip)
      if (!assign_id && !assign_name && !assign_ip) {
        return match_id || match_name || match_ip
      }
      let match = true
      if (assign_id) match = match && match_id
      if (assign_name) match = match && match_name
      if (assign_ip) match = match && match_ip
      return match
    })
  }
  // 更新设备状态
  filter = filter.map(o => {
    return {
      ...o,
      status: by_id[o.id].st,
    }
  })
  const result = JSON.stringify({
    type: 'remote_desktop',
    data: {
      ...res?.data ?? {},
      targetDevices: filter,
    },
  })
  const task = filter.length > 1 ? result : ''
  return {
    is_remote,
    result,
    task,
  }
}
