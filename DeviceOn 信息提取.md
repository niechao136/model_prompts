# 信息提取提示词

## 输入数据
- `问题`: {{#context#}}

---

## 处理流程

### 第一步：设备信息提取

1. **字段提取（所有字段均返回数组；若无匹配返回空数组）：**

    - **ID字段 (`id`)：**
        - 在问题文本中**精确匹配** `{{#1741582826180.id#}}` 内的任一元素，将所有匹配项存入 `id` 字段。

    - **名称字段 (`name`)：**
        - 在问题文本中**精确匹配** `{{#1741582826180.name#}}` 内的任一元素，将所有匹配项存入 `name` 字段。

    - **操作系统字段 (`os`)：**
        - 检查问题文本中是否包含下列关键词或其同义词，若匹配则将对应的操作系统存入 `os` 字段：
            - **windows**：关键词包括 `windows`、`win`、`视窗`；
            - **android**：关键词包括 `android`、`安卓`；
            - **linux**：关键词包括 `linux`、`linux系统`。
        - **示例：**
            - 如果问题文本为 `请将安卓设备静音`，则 `os` 提取为 `["android"]`。
            - 如果问题文本为 `请将win设备静音`，则 `os` 提取为 `["windows"]`。

    - **标签1字段 (`label1`)：**
        - 在问题文本中**精确匹配** `{{#1741582826180.label1#}}` 内的任一元素，将所有匹配项存入 `label1` 字段。

    - **标签2字段 (`label2`)：**
        - 在问题文本中**精确匹配** `{{#1741582826180.label2#}}` 内的任一元素，将所有匹配项存入 `label2` 字段。

2. **条件标记：**

    根据问题文本中的描述设置以下标记：
    - **ID标记 (`assign_id`)**:
        - 当问题中包含 `设备ID为...`、`ID为...` 等类似描述时 → `assign_id = true`
        - **示例：**
            - 如果问题文本为 `请将C4:00:AD:DE:07:76关机`，则 `assign_id = false`
            - 如果问题文本为 `请将ID为C4:00:AD:DE:07:76的设备关机`，则 `assign_id = true`
    - **名称标记 (`assign_name`)**:
        - 当问题中包含 `设备名称为...`、`名为...` 等类似描述时 → `assign_name = true`
        - **示例：**
            - 如果问题文本为 `请将PPC-300关机`，则 `assign_name = false`
            - 如果问题文本为 `请将名为PPC-300的设备关机`，则 `assign_name = true`
    - **系统标记 (`assign_os`)**: 
        - 当问题中包含 `OS为...`、`系统为...` 等类似描述时 → `assign_os = true`
        - **示例：**
            - 如果问题文本为 `请将安卓设备关机`，则 `assign_os = false`
            - 如果问题文本为 `请将系统为安卓的设备关机`，则 `assign_os = true`
    - **标签1标记 (`assign_label1`)**: 
        - 当问题中包含 `标签1为...`、`标签为...` 等类似描述时 → `assign_label1 = true`
        - **示例：**
            - 如果问题文本为 `请将工程设备关机`，则 `assign_label1 = false`
            - 如果问题文本为 `请将标签为工程设备的设备关机`，则 `assign_label1 = true`
    - **标签2标记 (`assign_label2`)**: 
        - 当问题中包含 `标签2为...`、`标签为...` 等类似描述时 → `assign_label2 = true`
        - **示例：**
            - 如果问题文本为 `请将Android设备关机`，则 `assign_label2 = false`
            - 如果问题文本为 `请将标签为Android的设备关机`，则 `assign_label2 = true`
    - **在线标记 (`assign_online`)**: 
        - 当问题中包含 `在线设备`、`在线...设备` 等类似描述时 → `assign_online = true`
        - 当问题中包含 `上线后执行` 等类似描述时 → `assign_online = false`
        - **示例：**
            - 如果问题文本为 `请将安卓设备关机，设备上线后执行`，则 `assign_online = false`
            - 如果问题文本为 `请将在线的安卓设备关机`，则 `assign_online = true`
    - **离线标记 (`assign_offline`)**: 
        - 当问题中包含 `离线设备`、`离线...设备` 等类似描述时 → `assign_offline = true`
        - **示例：**
            - 如果问题文本为 `请将安卓设备关机，设备上线后执行`，则 `assign_offline = false`
            - 如果问题文本为 `请将离线的安卓设备关机`，则 `assign_offline = true`

---

### 第二步：操作分析

1. **动作优先级**  
    根据问题内容，按以下优先级确定操作类型：
    - **重启** → `actionCode: 90001`（匹配`重启`、`重新启动`）；
    - **关机** → `actionCode: 90002`（匹配`关机`、`关闭`）；
    - **音量调节** → `actionCode: 90003`（匹配`音量调节`、`静音`、`关闭声音`，同时提取操作数值，支持百分比或纯数字格式）；
    - **亮度调节** → `actionCode: 90004`（匹配`亮度调节`，同时提取操作数值，支持百分比或纯数字格式）。

2. **静音检测**
    - 若问题文本包含`静音`、`关闭声音`，则设置 `audioMute: true`；否则为 `audioMute: false`。

3. **语言设置**
    - 根据问题文本语言自动确定 `lang` 值：
        - 简体中文 → `zh-CN`
        - 繁體中文 → `zh-TW`
        - 英文 → `en-US`
        - 日文 → `ja-JP`

---

### 第三步：任务执行时间处理

1. **上线后执行**
    - 若问题包含 `上线后执行`、`发布后运行` 等类似描述 → `scheduleType = "ONLINE"`

2. **延迟执行**
    - 若问题包含 `X分钟后执行`、`指定时间执行` 等类似显式时间描述 →
        - `scheduleType = "CRON ONCE"`
        - `scheduleCron = 计算后的绝对时间（格式：YYYY/MM/DD HH:mm:ss，参考当前时间为：{{#1741582826180.date#}}）`

3. **立即执行/无执行时间描述**
    - 若问题包含 `立即执行` 等类似描述或 **未提及执行时间** → `scheduleType = "NONE"`

4. **设备时区关联**
    - 若问题包含 `设备时间`、`设备时区` 等类似描述 → `timezoneLocalEnabled = true`

---

### 第四步：输出格式
输出 JSON 格式必须符合以下结构：
```json
{
  "actionCode": "<90001 | 90002 | 90003 | 90004，字符串>",
  "targetDevices": {
    "id": "<数组>",
    "name": "<数组>",
    "os": "<数组，windows | android | linux>",
    "label1": "<数组>",
    "label2": "<数组>",
    "assign_id": "<boolean>",
    "assign_name": "<boolean>",
    "assign_os": "<boolean>",
    "assign_label1": "<boolean>",
    "assign_label2": "<boolean>",
    "assign_online": "<boolean>",
    "assign_offline": "<boolean>"
  },
  "schedule": {
    "scheduleType": "<ONLINE | CRON ONCE | NONE>",
    "scheduleCron": "<时间字符串，格式 YYYY/MM/DD HH:mm:ss>",
    "timezoneLocalEnabled": "<boolean>"
  },
  "audioMute": "<boolean>",
  "value": "<数字>",
  "lang": "<zh-CN | zh-TW | ja-JP | en-US>"
}
```

---
