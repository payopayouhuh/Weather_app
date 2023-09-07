from datetime import datetime, timedelta
import numpy as np
from collections import defaultdict, Counter
import json

def aggregate_data(data, time_unit, num_cols, non_num_cols):
    aggregated_data = defaultdict(list)
    validTimeUtc_list = []
    week_to_date_range = defaultdict(list)
    
    for idx, time in enumerate(data["validTimeUtc"]):
        dt = datetime.fromisoformat(time.replace("+0000", "+00:00"))
        
        if time_unit == '/h':
            key = dt.strftime('%Y-%m-%d %H:%M:%S')
        elif time_unit == '/day':
            key = dt.strftime('%Y-%m-%d')
        elif time_unit == '/week':
            week_num = dt.strftime('%U')
            year = dt.year
            week_key = f"{year}-{week_num}"
            if week_key not in week_to_date_range:
                week_to_date_range[week_key] = [dt, dt]
            else:
                week_to_date_range[week_key][0] = min(week_to_date_range[week_key][0], dt)
                week_to_date_range[week_key][1] = max(week_to_date_range[week_key][1], dt)
            key = week_key
        elif time_unit == '/tri-month':
            day = dt.day
            if day <= 10:
                key = f"{dt.strftime('%Y-%m')}-E"
            elif day <= 20:
                key = f"{dt.strftime('%Y-%m')}-M"
            else:
                key = f"{dt.strftime('%Y-%m')}-L"
        elif time_unit == '/month':
            key = dt.strftime('%Y-%m')
        
        if key not in validTimeUtc_list:
            validTimeUtc_list.append(key)
        
        for k, v in data.items():
            if k != "validTimeUtc":
                aggregated_data[k].append((key, v[idx]))
    
    validTimeUtc_list.sort()
    
    if time_unit == '/week':
        validTimeUtc_list = [
            f"{week_to_date_range[wk][0].strftime('%Y-%m-%d')}-{week_to_date_range[wk][1].strftime('%Y-%m-%d')}"
            for wk in validTimeUtc_list
        ]
    
    result = {"validTimeUtc": validTimeUtc_list}
    
    for k in num_cols + non_num_cols:
        if k in aggregated_data:
            v = aggregated_data[k]
            grouped_data = defaultdict(list)
            
            for key, value in v:
                grouped_data[key].append(value)
            
            aggregated_result = []
            
            for key in validTimeUtc_list:
                values = grouped_data.get(key, [])
                
                if time_unit == '/h':
                    aggregated_result.append(values[0] if values else None)
                elif k in num_cols:
                    non_none_values = [i for i in values if i is not None]
                    if non_none_values:
                        aggregated_result.append(round(np.mean(non_none_values), 2))
                    else:
                        aggregated_result.append(None)
                elif k in non_num_cols:
                    mode_value = Counter(values).most_common(1)[0][0] if values else None
                    aggregated_result.append(mode_value)
            
            result[k] = aggregated_result
    
    return json.dumps(result, ensure_ascii=False, indent=4)



# time_unit = '/month'  # ここで集計単位を変更（'/h', '/day', '/week', '/1か月三分割', '/month'）
# num_cols = ['temperature']
# non_num_cols = ['iconCode']

# aggregated_data = aggregate_data(sample_data, time_unit, num_cols, non_num_cols)
# print(aggregated_data)
