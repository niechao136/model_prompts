/**
 * 确认任务信息
 */
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
function main({content, timezone, api}) {
  const res = JSON.parse(content)
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
    case 'trigger_task':
      const trigger_code = res.data.actionCode
      let trigger_param = {}
      if (trigger_code === '90003') {
        if (!!res.data.audioMute) {
          trigger_param = {
            audioMute: true,
          }
        } else {
          trigger_param = {
            volume: res.data.value,
          }
        }
      } else if (trigger_code === '90004') {
        trigger_param = {
          brightness: res.data.value,
        }
      }
      const trigger_device = Array.isArray(res?.data?.targetDevices) ? Array.from(res.data.targetDevices).map(o => {
        return {
          deviceId: o.id,
          deviceOs: o.os,
          timezone: o.timezone,
        };
      }) : []
      const baseUrl = String(api).endsWith('/api') ? String(api).slice(0, -4) : api
      url = '/walle/ai/triggerTask/addCommonTriggerTask'
      request = JSON.stringify({
        actionCode: trigger_code,
        baseUrl,
        parameter: trigger_param,
        targetDevices: trigger_device,
      })
      break
  }
  return {
    request,
    url,
  }
}


/**
 * 处理返回信息
 */
function main({content, body}) {
  const res = JSON.parse(content)
  const result = JSON.parse(body)
  return {
    result: JSON.stringify({
      ...res,
      result,
    }),
    content: '',
    type: '',
  }
}



function main({text})
{
  const obj = {"inputs":{"question":"{{#1743578342387.question#}}","type":"{{#1743578342387.cache_type#}}","content":"{{#1743578342387.cache_content#}}","timezone":"{{#1743578342387.timezone#}}","api":"{{#1743578342387.api#}}","token":"{{#1743578342387.token#}}"},"response_mode":"blocking","user":"deviceOn"}
  return {
    result: String(text).replaceAll(/<think>[\s\S]*?<\/think>/g, '').replaceAll(/<details[\s\S]*?<\/details>/g, ''),
    content: '',
    type: '',
  }
}

function main({}) {
  return {
    "cache_content": "[{\"id\":\"A0:19:B2:D1:F5:2D\",\"name\":\"rk3568_s\",\"os\":\"android\",\"timezone\":\"UTC+08:00\"},{\"id\":\"00:0A:F5:E5:A3:04\",\"name\":\"AIM-78_WIFI\",\"os\":\"android\",\"timezone\":\"UTC+08:00\"},{\"id\":\"C4:00:AD:50:5F:33\",\"name\":\"PPC-3211W-P75A\",\"os\":\"windows\",\"timezone\":\"UTC+08:00\"},{\"id\":\"C4:00:AD:87:C4:6B\",\"name\":\"昆山测试windows\",\"os\":\"windows\",\"timezone\":\"UTC+08:00\"}]",
    "cache_type": "find_device",
    "api": "https://dev-apps.deviceon-iservice.com/api",
    "token": "eyJhbGciOiJIUzUxMiJ9.eyJ1c2VyX2lkIjoxODksInVzZXJfa2V5IjoiYzA0MDdiNzgtY2M4Mi00NmU1LTkzZjItMTgwMjc4NzZjMmM5IiwidXNlcm5hbWUiOiJuaWVjaGFvMTU4QHFxLmNvbSJ9.i5R3PjWVlj6SDkS0YB1D-K02nbL9XMUjhRkSRmABtVKQj7HxHzYeyRa4jmo6PPdKaW5AcXf8SOBBSoxzAeecNw",
    "timezone": "UTC+08:00",
    "question": "AIM-78_WIFI REMOTE_DESKTOP",
    "request": JSON.stringify({
      "inputs": {
        "question": "AIM-78_WIFI REMOTE_DESKTOP",
        "type": "find_device",
        "content": "[{\"id\":\"A0:19:B2:D1:F5:2D\",\"name\":\"rk3568_s\",\"os\":\"android\",\"timezone\":\"UTC+08:00\"},{\"id\":\"00:0A:F5:E5:A3:04\",\"name\":\"AIM-78_WIFI\",\"os\":\"android\",\"timezone\":\"UTC+08:00\"},{\"id\":\"C4:00:AD:50:5F:33\",\"name\":\"PPC-3211W-P75A\",\"os\":\"windows\",\"timezone\":\"UTC+08:00\"},{\"id\":\"C4:00:AD:87:C4:6B\",\"name\":\"昆山测试windows\",\"os\":\"windows\",\"timezone\":\"UTC+08:00\"}]",
        "api": "https://dev-apps.deviceon-iservice.com/api",
        "token": "eyJhbGciOiJIUzUxMiJ9.eyJ1c2VyX2lkIjoxODksInVzZXJfa2V5IjoiYzA0MDdiNzgtY2M4Mi00NmU1LTkzZjItMTgwMjc4NzZjMmM5IiwidXNlcm5hbWUiOiJuaWVjaGFvMTU4QHFxLmNvbSJ9.i5R3PjWVlj6SDkS0YB1D-K02nbL9XMUjhRkSRmABtVKQj7HxHzYeyRa4jmo6PPdKaW5AcXf8SOBBSoxzAeecNw",
        "timezone": "UTC+08:00",
      },
      "response_mode": "blocking",
      "user": "deviceOn"
    })
  }
}

