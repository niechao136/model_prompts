# 信息提取提示词

## 输入数据
- `问题`: {{#context#}}

---

## 设备相关性判断
判断问题所求是否涉及设备：
- **如果问题所求为设备**，则设置 `assign_device = true` 并继续进行设备信息提取；
- **否则**，设置 `assign_device = false` 并跳过设备信息提取过程。

---

## 设备信息提取（仅当 assign_device 为 true 时执行）

1. **字段提取（所有字段均返回数组；若无匹配返回空数组）：**

    - **ID字段 (`id`)：**
        - 在问题文本中**精确匹配** `{{#1742189408356.id#}}` 内的任一元素，将所有匹配项存入 `id` 字段。

    - **名称字段 (`name`)：**
        - 在问题文本中**精确匹配** `{{#1742189408356.name#}}` 内的任一元素，将所有匹配项存入 `name` 字段。

    - **操作系统字段 (`os`)：**
        - 检查问题文本中是否包含下列关键词或其同义词，若匹配则将对应的操作系统存入 `os` 字段：
            - **windows**：关键词包括 `windows`、`win`、`视窗`；
            - **android**：关键词包括 `android`、`安卓`；
            - **linux**：关键词包括 `linux`、`linux系统`。
        - **示例：**
            - 如果问题文本为 `请将安卓设备静音`，则 `os` 提取为 `["android"]`；
            - 如果问题文本为 `请将win设备静音`，则 `os` 提取为 `["windows"]`。

    - **标签1字段 (`label1`)：**
        - 在问题文本中**精确匹配** `{{#1742189408356.label1#}}` 内的任一元素，将所有匹配项存入 `label1` 字段。

    - **标签2字段 (`label2`)：**
        - 在问题文本中**精确匹配** `{{#1742189408356.label2#}}` 内的任一元素，将所有匹配项存入 `label2` 字段。

2. **条件标记：**

   根据问题文本中的描述设置以下标记：

    - **ID标记 (`assign_id`)**:
        - 当问题中包含 “设备ID为...” 或 “ID为...” 等描述时，设置 `assign_id = true`；
        - **示例：**
            - 问题为 `请将C4:00:AD:DE:07:76关机` 时，`assign_id = false`；
            - 问题为 `请将ID为C4:00:AD:DE:07:76的设备关机` 时，`assign_id = true`。

    - **名称标记 (`assign_name`)**:
        - 当问题中包含 “设备名称为...” 或 “名为...” 等描述时，设置 `assign_name = true`；
        - **示例：**
            - 问题为 `请将PPC-300关机` 时，`assign_name = false`；
            - 问题为 `请将名为PPC-300的设备关机` 时，`assign_name = true`。

    - **系统标记 (`assign_os`)**:
        - 当问题中包含 “OS为...” 或 “系统为...” 等描述时，设置 `assign_os = true`；
        - **示例：**
            - 问题为 `请将安卓设备关机` 时，`assign_os = false`；
            - 问题为 `请将系统为安卓的设备关机` 时，`assign_os = true`。

    - **标签1标记 (`assign_label1`)**:
        - 当问题中包含 “标签1为...” 或 “标签为...” 等描述时，设置 `assign_label1 = true`；
        - **示例：**
            - 问题为 `请将工程设备关机` 时，`assign_label1 = false`；
            - 问题为 `请将标签为工程设备的设备关机` 时，`assign_label1 = true`。

    - **标签2标记 (`assign_label2`)**:
        - 当问题中包含 “标签2为...” 或 “标签为...” 等描述时，设置 `assign_label2 = true`；
        - **示例：**
            - 问题为 `请将Android设备关机` 时，`assign_label2 = false`；
            - 问题为 `请将标签为Android的设备关机` 时，`assign_label2 = true`。

    - **在线标记 (`assign_online`)**:
        - 当问题中包含 “在线设备” 或 “在线...设备” 等描述时，设置 `assign_online = true`；
        - 当问题中包含 “上线后执行” 等描述时，设置 `assign_online = false`；
        - **示例：**
            - 问题为 `请将安卓设备关机，设备上线后执行` 时，`assign_online = false`；
            - 问题为 `请将在线的安卓设备关机` 时，`assign_online = true`。

    - **离线标记 (`assign_offline`)**:
        - 当问题中包含 “离线设备” 或 “离线...设备” 等描述时，设置 `assign_offline = true`；
        - **示例：**
            - 问题为 `请将离线的安卓设备关机` 时，`assign_offline = true`。

    - **异常状态标记：**
        - **assign_error**：当问题中提及 “异常” 但未提及下列具体异常（“硬件异常”、“软件异常”、“电池异常”、“周边设备异常”、“设备安全异常”）时，设置 `assign_error = true`；
        - **assign_hardware**：当问题中提及 “硬件异常” 时，设置 `assign_hardware = true`；
        - **assign_software**：当问题中提及 “软件异常” 时，设置 `assign_software = true`；
        - **assign_battery**：当问题中提及 “电池异常” 时，设置 `assign_battery = true`；
        - **assign_peripheral**：当问题中提及 “周边设备异常” 时，设置 `assign_peripheral = true`；
        - **assign_security**：当问题中提及 “设备安全异常” 时，设置 `assign_security = true`。

---

## 语言设置
根据问题文本语言自动确定 `lang` 值：
- 简体中文 → `zh-CN`
- 繁體中文 → `zh-TW`
- 英文 → `en-US`
- 日文 → `ja-JP`

---

## 输出格式
输出 JSON 格式必须符合以下结构：
```json
{
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
  "assign_offline": "<boolean>",
  "assign_device": "<boolean>",
  "assign_error": "<boolean>",
  "assign_hardware": "<boolean>",
  "assign_software": "<boolean>",
  "assign_battery": "<boolean>",
  "assign_peripheral": "<boolean>",
  "assign_security": "<boolean>",
  "lang": "<zh-CN | zh-TW | ja-JP | en-US>"
}
```

---


```markdown
# 设备筛选问题判断与条件提取提示词

## 输入分析
用户问题：{{question}}

## 处理规则
1. 判断逻辑：
   - 若问题包含以下特征 ➔ `assign_device = true`
     ✓ 使用"找出/筛选/查询"等动词
     ✓ 包含"设备/终端"等主体对象
     ✓ 带有至少1个限定条件
   - 否则 ➔ `assign_device = false`

2. 条件解析规范：
```json
{
  "assign_device": <boolean>,
  "question": "<原始问题文本>",
  "conditions": [
    {
      "field": "<id|nm|os|l1|l2|st|hw|sw|bt|pp|sc|error|none>",
      "value": "<根据字段类型动态赋值>",
      "os": "<windows|android|linux|空>"
    }
  ]
}
```

## 字段赋值标准
| 条件特征       | field          | value 规则  |
|------------|----------------|-----------|
| 设备ID/名称/标签 | id/nm/l1/l2    | 直接提取字符串   |
| 在线/离线状态    | st             | 在线=1，离线=0 |
| 特定类型异常     | hw/sw/bt/pp/sc | 固定值1      |
| 未分类异常      | error          | 固定值1      |
| 操作系统限定     | os             | 同时设置os字段值 |
| 模糊状态/异常描述  | none           | 提取描述关键词   |

## 输出规范
严格遵循以下结构：
```json
{
  "assign_device": true,
  "question": "原始问题内容",
  "conditions": [
    {
      "field": "st",
      "value": 1,
      "os": "android"
    },
    {
      "field": "hw",
      "value": 1
    }
  ]
}
```


```markdown
# 设备筛选问题判断与条件提取标准

## 输入问题
- `问题`: {{#context#}}

## 处理规范
```json
{
  "assign_device": <boolean>,
  "conditions": [
    {
      "field": "<id|nm|os|l1|l2|la|st|hw|sw|bt|pp|sc|error|none>",
      "value": "<按照字段赋值规则赋值>",
      "os": "<windows|android|linux|空>"
    }
  ]
}
```

### 判断逻辑
当问题文本满足主体对象为`设备/终端`时设置 `assign_device=true`

### 字段赋值规则
| 条件特征        | field 取值 | value 规则    | os 要求                     |
|-------------|----------|-------------|---------------------------|
| 明确指定设备ID    | l1       | 原文设备ID内容    | 空                         |
| 明确指定设备名称    | l1       | 原文设备名称内容    | 空                         |
| 明确指定标签1     | l1       | 原文标签1内容     | 空                         |
| 明确指定标签2     | l2       | 原文标签2内容     | 空                         |
| 未指定具体标签     | la       | 原文标签内容      | 空                         |
| 明确指定系统      | os       | 原文系统内容      | 必填（windows/android/linux） |
| 明确指定在线/离线状态 | st       | 1(在线)/0(离线) | 空                         |
| 明确指定硬件异常    | hw       | 固定1         | 空                         |
| 明确指定软件异常    | sw       | 固定1         | 空                         |
| 明确指定电池异常    | bt       | 固定1         | 空                         |
| 明确指定周边外设异常  | pp       | 固定1         | 空                         |
| 明确指定设备安全异常  | sc       | 固定1         | 空                         |
| 未指定具体异常     | error    | 固定1         | 空                         |
| 未指定具体属性的条件  | none     | 原文描述文本      | 必填（windows/android/linux） |


### 输出示例
1. 混合条件："找出带测试标签的Windows设备"
    ```json
    {
      "assign_device": true,
      "conditions": [
        {"field": "la", "value": "测试标签"},
        {"field": "os", "value": "windows", "os": "windows"}
      ]
    }
    ```

2. 未分类异常："查询所有异常的安卓终端"
    ```json
    {
      "assign_device": true,
      "conditions": [
        {"field": "error", "value": 1},
        {"field": "os", "value": "android", "os": "android"}
      ]
    }
    ```
