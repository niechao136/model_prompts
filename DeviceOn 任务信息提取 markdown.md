# 信息提取提示词

## 输入数据
- **问题**：{{#context#}}
- **设备列表**：
  ```json
  {{#1741582826180.device#}}
  ```

---

## 输入说明
- **设备列表**：该列表为对象数组，每个对象包含如下属性：
    - `id`：设备ID
    - `name`：设备名称
    - `os`：设备操作系统（取值：`windows`、`android`、`linux`）
    - `label1`：设备标签1
    - `label2`：设备标签2
    - `status`：在线状态（`0`表示离线，`1`表示在线）
    - `timezone`：设备时区

---

## 处理流程

### 第一步：设备显示标记（强制完整遍历）
1. **输出完整性**
    - 必须对输入设备列表中**每个**设备生成一项，确保输出的 **targetDevices** 数组条目数量与原始设备列表严格一致，且顺序不变。
    - **重要：在输出答案前，请先验证 targetDevices 数组长度与原始设备列表长度是否一致；如果不一致，则必须重新遍历设备列表，直至每个设备均生成对应项（即使匹配结果为 false 也要输出）。**

2. **匹配规则**
    - **特殊情况处理**
        - 如果问题文本中明确指定了任一设备字段（如 `id`、`os`、`label1`、`label2`、`name` 或 `status`），则仅基于该指定字段进行匹配，忽略其他字段的匹配要求。

    - **默认匹配顺序**（仅在问题文本未明确指定单一字段时执行，要求全词匹配，不允许部分或模糊匹配）：
        1. **操作系统匹配（最高优先级）**
            - 当问题文本中包含操作系统关键词（例如“windows”、“win”、“android”、“安卓”、“linux”等）时，仅对设备的 `os` 字段进行匹配：
                - 若问题中包含“windows”或其同义词（如“win”），仅将设备 `os` 为 `windows` 的设备设置 `show = true`；
                - 若问题中包含“android”或其同义词（如“安卓”），仅将设备 `os` 为 `android` 的设备设置 `show = true`；
                - 若问题中包含“linux”或其同义词（如“unix”），仅将设备 `os` 为 `linux` 的设备设置 `show = true`。
            - 如果设备的操作系统与问题中指定的不一致，则设置 `show = false`。

        2. **id 字段**
            - 若问题文本中完整出现设备的 `id`，则设置 `show = true`。

        3. **label1 字段**
            - 若设备的 `label1` 非空，且问题文本中完整出现该标签，则设置 `show = true`。

        4. **label2 字段**
            - 若设备的 `label2` 非空，且问题文本中完整出现该标签，则设置 `show = true`。

        5. **name 字段**
            - 若问题文本中完整出现设备的 `name`，则设置 `show = true`。

        - 如果以上字段均未匹配，则设置 `show = false`。

3. **状态叠加标记**
    - 如果问题文本中包含“在线”、“离线”或类似状态描述，且问题未明确指定单一字段时，按以下规则调整：
        - 当问题要求“在线”时，仅保留已标记 `show = true` 且设备 `status` 为 `1` 的设备；若设备 `status` 不为 `1`，则更新为 `show = false`。
        - 当问题要求“离线”时，仅保留设备 `status` 为 `0` 的设备，其它设备更新为 `show = false`。

4. **输出要求**
    - 对于每个输入设备，输出时均须追加 `show` 属性，确保 **targetDevices** 数组条目数量与原始设备列表完全一致，不得遗漏或增加额外条目。

---

### 第二步：操作分析
1. **动作优先级**  
   根据问题内容，按以下优先级确定操作类型：
    - **重启** → `actionCode: 90001`（匹配“重启”或“重新启动”）；
    - **关机** → `actionCode: 90002`（匹配“关机”或“关闭”）；
    - **音量调节** → `actionCode: 90003`（匹配“音量调节”，同时提取操作数值，支持百分比或纯数字格式）；
    - **亮度调节** → `actionCode: 90004`（匹配“亮度调节”，同时提取操作数值，支持百分比或纯数字格式）。

2. **静音检测**
    - 若问题文本包含“静音”或“关闭声音”，则设置 `audioMute: true`；否则为 `audioMute: false`。

3. **语言设置**
    - 根据问题文本语言自动确定 `lang` 值：
        - 简体中文 → `zh-CN`
        - 繁體中文 → `zh-TW`
        - 英文 → `en-US`
        - 日文 → `ja-JP`

---

### 第三步：输出格式
输出 JSON 格式必须符合以下结构：
```json
{
  "actionCode": "<操作代码>",
  "targetDevices": [
    // 数组顺序与输入设备列表保持一致，条目数量严格相同
    {
      "id": "<设备ID>",
      "show": "<显示标记>", // true 或 false
    }
  ],
  "audioMute": "<是否静音>",
  "value": "<操作数值>",
  "lang": "<问题语言代码>"
}
```

---




,id                ,name                         ,ip             ,os      ,label1  ,label2  ,status ,timezone ,
,C4:00:AD:DE:07:76 ,PPC-300                      ,172.21.84.152  ,android ,工程设备    ,Android ,0      ,UTC      ,
,C4:00:AD:E4:DE:47 ,PPC-300                      ,172.21.84.37   ,android ,        ,        ,0      ,UTC      ,
,A0:19:B2:D1:94:9F ,rk3288-An1-AKTC1             ,192.168.50.73  ,android ,Kiosk   ,Android ,0      ,UTC+08:00,
,7C:D3:0A:41:A4:F2 ,AIM75-WIFI                   ,192.168.13.131 ,android ,工程设备    ,Android ,0      ,UTC+08:00,
,B8:13:32:B3:F9:8A ,rk3568_s                     ,172.21.73.70   ,android ,        ,        ,0      ,UTC+08:00,
,02:00:00:00:00:00 ,Android SDK built for x86_64 ,10.0.2.16      ,android ,        ,        ,0      ,UTC      ,
,74:FE:48:7E:C3:30 ,(Mark) DLT-V7310AP           ,172.22.132.91  ,android ,Signage ,Android ,0      ,UTC      ,
,08:00:27:3C:56:71 ,qa                           ,172.21.73.157  ,linux   ,        ,Linux   ,0      ,UTC+08:00,
,CC:82:7F:5F:A0:9D ,PPC-300                      ,172.21.84.110  ,android ,        ,        ,0      ,UTC      ,
,02:00:00:44:55:66 ,Android SDK built            ,192.168.232.2  ,android ,        ,        ,0      ,UTC+08:00,
,A0:19:B2:D1:F5:2D ,rk3568_s                     ,192.168.60.184 ,android ,Signage ,Android ,1      ,UTC+08:00,
,52:54:00:12:34:56 ,Android SDK built for x86_64 ,10.0.2.15      ,android ,        ,        ,0      ,UTC+00:00,
,00:0A:F5:E5:A3:04 ,AIM-78_WIFI                  ,192.168.13.119 ,android ,        ,        ,1      ,UTC      ,
,CC:82:7F:35:A4:22 ,TPC_1XX                      ,172.21.73.60   ,android ,工程设备    ,Android ,0      ,UTC      ,
,CE:F7:D7:DC:C8:6B ,rk3399_Android12             ,172.21.73.60   ,android ,Kiosk   ,Android ,0      ,UTC+08:00,
,C4:00:AD:50:5F:33 ,PPC-3211W-P75A               ,172.21.73.143  ,windows ,        ,        ,0      ,UTC+08:00,
,DA:8B:FC:DF:3A:37 ,Rockchip                     ,172.21.84.201  ,android ,        ,        ,0      ,UTC+08:00,
,74:FE:48:7E:C3:0D ,DLT-V7310AP                  ,172.21.84.86   ,android ,        ,        ,0      ,UTC+08:00,
,54:B2:03:9D:9D:1E ,deviceon-ubuntu              ,172.21.169.26  ,linux   ,        ,        ,0      ,UTC+08:00,
,C4:00:AD:87:C4:6B ,昆山测试windows                ,172.21.169.20  ,windows ,        ,        ,1      ,UTC+08:00,
,08:00:27:FD:B8:50 ,qa-VirtualBox                ,172.21.73.196  ,linux   ,        ,        ,0      ,UTC+08:00,
,00:19:0F:3D:1D:31 ,UBX-310H                     ,172.22.132.228 ,windows ,        ,windows ,1      ,UTC-08:00,
,74:FE:48:7E:C3:7B ,DLT-V7312AP+                 ,172.21.84.48   ,android ,        ,        ,0      ,UTC+08:00,
,7C:D3:0A:41:A5:3E ,AIM75-WIFI                   ,192.168.13.107 ,android ,        ,        ,0      ,UTC-04:00,



---

# 信息提取提示词

## 输入数据
- **问题**：{{#context#}}
- **设备列表**：
  ```json
  {{#1741582826180.device#}}
  ```

---

## 输入说明
- **设备列表**：该列表为对象数组，每个对象包含如下属性：
    - `id`：设备ID
    - `name`：设备名称
    - `os`：设备操作系统（取值：`windows`、`android`、`linux`）
    - `label1`：设备标签1
    - `label2`：设备标签2
    - `status`：在线状态（`0`表示离线，`1`表示在线）
    - `timezone`：设备时区

---

## 强化约束条件
❗ 必须遵守以下硬性要求：
1. **绝对等长原则**：输出数组必须与输入设备列表条目数100%一致
2. **顺序不变原则**：设备顺序严格保持原始排列
3. **零丢失原则**：即使所有匹配失败也必须保留条目

---

## 处理流程

### 第一步：设备显示标记（强制完整遍历）

1. **字段专项匹配（当问题明确指定字段时）**
    ```python
    if any(field in 问题文本 for field in ["ID","设备编号","序列号"]):
        执行id精确匹配：
        for device in devices:
            device.show = str(device.id) in 问题文本
    
    elif any(keyword in 问题文本 for keyword in ["系统","操作系统","os","平台"]):
        执行os匹配：
        os_map = {
            "windows": ["win", "windows", "视窗"],
            "android": ["安卓", "android"],
            "linux": ["linux", "unix"]
        }
        for device in devices:
            device.show = any(
                kw in 问题文本 
                for kw in os_map.get(device.os, [])
            
    elif any(label_keyword in 问题文本 for label_keyword in ["标签1","分类1"]):
        执行label1全词匹配...
    （其他字段类似，此处折叠）
    
    ```
   
2. **五级匹配流程（当未指定字段时）**
    ```python
    for device in devices:
        # 初始化匹配状态
        match_status = False
        
        # 优先级1：操作系统匹配
        if not match_status:
            os_keywords = {
                "windows": ["win", "windows"],
                "android": ["安卓", "android"],
                "linux": ["linux"]
            }
            match_status = any(
                kw in 问题文本 
                for kw in os_keywords.get(device.os, [])
            )
        
        # 优先级2：ID匹配（需完全一致）
        if not match_status:
            match_status = str(device.id) in 问题文本
        
        # 优先级3：label1全词匹配
        if not match_status and device.label1:
            match_status = device.label1 in 问题文本
        
        # 优先级4：label2全词匹配 
        if not match_status and device.label2:
            match_status = device.label2 in 问题文本
        
        # 优先级5：名称匹配
        if not match_status:
            match_status = device.name in 问题文本
        
        device.show = match_status
    ```

3. **状态叠加过滤**
    ```python
    if "在线" in 问题文本 or "online" in 问题文本.lower():
        for device in devices:
            if device.show:  # 只影响已匹配设备
                device.show = (device.status == 1)
    
    elif "离线" in 问题文本 or "offline" in 问题文本.lower():
        for device in devices:
            device.show = (device.status == 0)  # 覆盖之前所有匹配结果
    ```

---

#### 完整性保障机制
1. **预初始化数组**：
    ```python
    targetDevices = [
        {"id": dev.id, "show": False} 
        for dev in original_devices
    ]
    ```
2. **双重校验**：
    - 遍历前校验数组长度
    - 最终输出前使用断言：  
      `assert len(targetDevices) == len(original_devices)`
3. **异常恢复协议**：
    - 当发现缺失时，按原始顺序重建数组
    - 缺失项补为`{"id": "原始ID", "show": false}`

---

### 第二步：操作分析
1. **动作优先级**  
   根据问题内容，按以下优先级确定操作类型：
    - **重启** → `actionCode: 90001`（匹配“重启”或“重新启动”）；
    - **关机** → `actionCode: 90002`（匹配“关机”或“关闭”）；
    - **音量调节** → `actionCode: 90003`（匹配“音量调节”，同时提取操作数值，支持百分比或纯数字格式）；
    - **亮度调节** → `actionCode: 90004`（匹配“亮度调节”，同时提取操作数值，支持百分比或纯数字格式）。

2. **静音检测**
    - 若问题文本包含“静音”或“关闭声音”，则设置 `audioMute: true`；否则为 `audioMute: false`。

3. **语言设置**
    - 根据问题文本语言自动确定 `lang` 值：
        - 简体中文 → `zh-CN`
        - 繁體中文 → `zh-TW`
        - 英文 → `en-US`
        - 日文 → `ja-JP`

---

### 第三步：输出格式
**禁止使用//注释、...省略符等非标准JSON标记，所有设备必须显式输出**
输出 JSON 格式必须符合以下结构：
```json
{
  "actionCode": "<操作代码>",
  "originalDevices": [
    // 原始设备列表
    {
      "id": "<设备ID>"
    }
  ],
  "targetDevices": [
    // 数组顺序与输入设备列表保持一致，条目数量严格相同
    {
      "id": "<设备ID>",
      "show": "<显示标记>", // true 或 false
    }
    // ...严格保持与输入设备列表完全相同的条目数量
  ],
  "audioMute": "<是否静音>",
  "value": "<操作数值>",
  "lang": "<问题语言代码>"
}
```

---


以下是包含完整匹配流程细节的强化提示词：

```markdown
# 信息提取强化提示词（完整版）

## 输入数据
- **问题**：{{#context#}}
- **设备列表**：
  ```json
  {{#1741582826180.device#}}
  ```

---

## 强化约束条件
❗ 必须遵守以下硬性要求：
1. **绝对等长原则**：输出数组必须与输入设备列表条目数100%一致
2. **顺序不变原则**：设备顺序严格保持原始排列
3. **零丢失原则**：即使所有匹配失败也必须保留条目

---

## 完整匹配流程

### 第一步：字段专项匹配（当问题明确指定字段时）
```python
if any(field in 问题文本 for field in ["ID","设备编号","序列号"]):
    执行id精确匹配：
    for device in devices:
        device.show = str(device.id) in 问题文本

elif any(keyword in 问题文本 for keyword in ["系统","操作系统","os","平台"]):
    执行os匹配：
    os_map = {
        "windows": ["win", "windows", "视窗"],
        "android": ["安卓", "android"],
        "linux": ["linux", "unix"]
    }
    for device in devices:
        device.show = any(
            kw in 问题文本 
            for kw in os_map.get(device.os, [])
        
elif any(label_keyword in 问题文本 for label_keyword in ["标签1","分类1"]):
    执行label1全词匹配...
（其他字段类似，此处折叠）

```

### 第二步：默认五级匹配流程（当未指定字段时）
```python
for device in devices:
    # 初始化匹配状态
    match_status = False
    
    # 优先级1：操作系统匹配
    if not match_status:
        os_keywords = {
            "windows": ["win", "windows"],
            "android": ["安卓", "android"],
            "linux": ["linux"]
        }
        match_status = any(
            kw in 问题文本 
            for kw in os_keywords.get(device.os, [])
        )
    
    # 优先级2：ID匹配（需完全一致）
    if not match_status:
        match_status = str(device.id) in 问题文本
    
    # 优先级3：label1全词匹配
    if not match_status and device.label1:
        match_status = device.label1 in 问题文本
    
    # 优先级4：label2全词匹配 
    if not match_status and device.label2:
        match_status = device.label2 in 问题文本
    
    # 优先级5：名称匹配
    if not match_status:
        match_status = device.name in 问题文本
    
    device.show = match_status
```

### 第三步：状态叠加过滤
```python
if "在线" in 问题文本 or "online" in 问题文本.lower():
    for device in devices:
        if device.show:  # 只影响已匹配设备
            device.show = (device.status == 1)

elif "离线" in 问题文本 or "offline" in 问题文本.lower():
    for device in devices:
        device.show = (device.status == 0)  # 覆盖之前所有匹配结果
```

---

## 完整性保障机制
1. **预初始化数组**：
```python
targetDevices = [
    {"id": dev.id, "show": False} 
    for dev in original_devices
]
```
2. **双重校验**：
    - 遍历前校验数组长度
    - 最终输出前使用断言：  
      `assert len(targetDevices) == len(original_devices)`
3. **异常恢复协议**：
    - 当发现缺失时，按原始顺序重建数组
    - 缺失项补为`{"id": "原始ID", "show": false}`

---

## 输出格式（不变）
（保持原有JSON结构）
```

主要改进点：
1. 显式使用python伪代码描述匹配流程
2. 完整展开字段专项匹配的每个分支
3. 明确五级匹配的优先级实现
4. 添加预初始化数组的保障机制
5. 使用编程语言的断言机制描述校验过程

通过这种类代码的表述方式，可以强制模型按明确的程序逻辑处理每个设备，避免自由发挥导致的条目丢失问题。
