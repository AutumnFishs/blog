---
title: react封装函数校验遇到的问题
date: 2025-02-18
tags:
  - [Hook]
abstract: 项目中使用tailwindcss作为样式的预编译器，UI选择也是使用Shadcn、Radix UI，以及原生表单标签，这些库的表单校验逻辑都需要自己去实现，但是在实现过程遇到了一些问题没有解决，在这里记录一下。
---

# React封装函数校验遇到的问题
项目中使用tailwindcss作为样式的预编译器，UI选择也是使用Shadcn、Radix UI，以及原生表单标签，这些库的表单校验逻辑都需要自己去实现，但是在实现过程遇到了一些问题没有解决，在这里记录一下。

## useValidateField
``` tsx
// 规则校验
interface ValidationRule {
  field: string;
  name: string;
  value: string;
  maxLength?: number;
  regExp?: RegExp;
  msg?: string;
  required?: Boolean;
}
export const useValidateField = (validationRules: ValidationRule[]) => {
  const [errors, setErrors] = useState<{
    [key: string]: any;
  }>(
    validationRules.reduce((acc, rule) => {
      acc[rule.field] = "";
      return acc;
    }, {})
  );
  const validateField = ({
    name,
    value,
    maxLength,
    regExp,
    msg,
    required = true,
  }: ValidationRule) => {
    if (required && !value) return `${name}不能为空`;

    if (regExp && !regExp.test(value)) {
      return msg || "格式不正确";
    }

    if (maxLength !== undefined && value?.length > maxLength) {
      return `${name}长度不能超过${maxLength}个字符`;
    }

    return "";
  };
  const handleValidateField = (field, value) => {
    const error = validateField({
      field,
      value,
      ...validationRules.find((rule) => rule.field === field),
    });
    setErrors({ ...errors, [field]: error });
  };
  const handleValidateFieldAll = (fields: string[], values: string[]) => {
    const newErrors = {};
    fields.forEach((field, index) => {
      const error = validateField({
        field,
        value: values[index],
        ...validationRules.find((rule) => rule.field === field),
      });
      newErrors[field] = error;
    });
    setErrors(newErrors);
    return Object.values(newErrors).some((error) => error);
  };
  return {
    errors,
    setErrors,
    handleValidateField,
    handleValidateFieldAll,
    handleErrorReset: () => setErrors({}),
  };
};
```
### 总结
#### 实现功能
可以满足一般场景的使用
1. 支持单个字段校验
2. 支持批量校验
3. 只做校验，不负责具体的数据处理
#### 存在的问题
1. 批量校验时会出现需要传递的参数过多，导致校验函数过于臃肿,比如：
``` tsx
    const validateFieldRes = handleValidateFieldAll(
    [
    ...data.map((item) => {
        return "xx" + item.id;
    }),
    ...data.map((item) => {
        return "yy" + item.id;
    }),
    ...data.map((item) => {
        return "zz" + item.id;
    }),
    ],
    [
    ...data.map((item) => {
        return item.xx;
    }),
    ...data.map((item) => {
        return item.yy;
    }),
    ...data.map((item) => {
        return item.zz;
    }),
    ]
);
```
2. 使用过程中values的值需要手动更新，并且失去焦点校验时，需要手动调用校验函数
``` tsx
<Input
    className="min-h-[36px] rounded border-none bg-[rgba(0,0,0,0)] text-[#111] shadow-none transition-none"
    value={el.xx}
    placeholder={"请填写备注"}
    onChange={(e) => {
    data[i].xx = e.target.value;
    setData([...data]);
    }}
    onBlur={(e) => {
    handleValidateField(`xx${el.id}`, e.target.value);
    }}
></Input>
```

## useFormValidation
``` tsx
/**
 * 表单验证 Hook
 *
 * @param initialValues - 表单字段的初始值，类型为一个对象，键为字段名，值为字段的初始值。
 * @param validationRules - 验证规则，类型为一个对象，键为字段名，值为对应的验证规则数组或者函数。
 * @param chainMode - 是否启用链式校验，默认关闭。
 *
 * @returns {Object} 返回一个对象，包含以下属性：
 *   - values: 当前表单字段的值，类型为一个对象，键为字段名，值为字段的当前值。
 *   - errors: 当前表单字段的错误信息，类型为一个对象，键为字段名，值为对应的错误信息组成的数组。
 *   - handleChange: 更新字段值的函数，接受事件对象作为参数。
 *      - 如果传入的是字符串，则第二个参数需要传入字段名。
 *      - 如果传入的是事件对象，则从事件对象中获取字段名和值，并更新对应字段的值。
 *      - 支持更新普通对象、嵌套对象和数组中的元素。
 *      - 字段名可以使用点分隔符（`.`）表示嵌套属性，使用方括号（`[]`）表示数组索引。
 *      - 例如：
 *          - 更新普通对象: name="name"
 *          - 更新嵌套对象: name="user.firstName"
 *          - 更新数组中的元素: name="0.value"
 *          - 更新嵌套数组中的元素: name="items[0].details[1].description"
 *   - handleSubmit: 提交表单的函数，接受一个提交回调函数作为参数，返回一个事件处理函数。
 */
export function useFormValidation(
  initialValues: Record<string, any>,
  initialValidationRules: Record<string, any>,
  chainMode: boolean = false
) {
  const [values, setValues] = useState<Record<string, any>>(initialValues); // 表单字段值
  const [errors, setErrors] = useState<Record<string, string[]>>({}); // 错误信息
  const [validationRules, setValidationRules] = useState<Record<string, any>>(
    initialValidationRules
  );
  useEffect(() => {
    setValidationRules(initialValidationRules);
  }, [initialValidationRules]);
  useEffect(() => {
    setValues(initialValues);
  }, [initialValues]);
  // 重载函数定义
  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ): void;
  function handleChange(value: string, name: string): void;
  function handleChange(e: any, name?: string) {
    let value: string;

    // 检查参数类型
    if (typeof e === "string") {
      value = e;
      if (!name) {
        throw new Error(
          "当第一个参数为字符串时，必须传入字段名作为第二个参数。"
        );
      }
    } else {
      const { target } = e;
      value = target.value;
      name = target.name;
    }

    // 处理深层次的值的修改
    const keys = name.split(/\.|\[|\]/).filter(Boolean);
    setValues((prevValues) => {
      const updatedValues = Array.isArray(prevValues)
        ? [...prevValues]
        : { ...prevValues };

      let current = updatedValues;
      for (let i = 0; i < keys.length - 1; i++) {
        const key = keys[i];
        const nextKey = keys[i + 1];

        if (Array.isArray(current)) {
          const index = current.findIndex((item) => item.key === key);
          if (index === -1) {
            throw new Error(`未找到具有 key ${key} 的项`);
          }
          current = current[index];
        } else {
          if (!current[key]) {
            current[key] = isNaN(Number(nextKey)) ? {} : [];
          }
          current = current[key];
        }
      }

      current[keys[keys.length - 1]] = value;

      return updatedValues;
    });
  }

  // 校验字段的通用函数
  const validateFieldValue = (name: string, value: any) => {
    const rules = validationRules[name];
    const errorMessages: string[] = [];

    if (rules) {
      const rulesArray = Array.isArray(rules) ? rules : [rules];

      for (const rule of rulesArray) {
        if (typeof rule === "function") {
          const errorMessage = rule(value);
          if (errorMessage) {
            errorMessages.push(errorMessage);
            if (!chainMode) break;
          }
        } else {
          if (rule.required && !value) {
            errorMessages.push(rule.message);
            if (!chainMode) break;
          }
          if (rule.minLength && value.length < rule.minLength) {
            errorMessages.push(rule.message);
            if (!chainMode) break;
          }
          if (rule.maxLength && value.length > rule.maxLength) {
            errorMessages.push(rule.message);
            if (!chainMode) break;
          }
          if (rule.pattern && !rule.pattern.test(value)) {
            errorMessages.push(rule.message);
            if (!chainMode) break;
          }
        }
      }
    }

    return errorMessages; // 返回所有错误消息
  };

  // 校验单个字段
  const validateField = (name: string, value: any) => {
    const errorMessages = validateFieldValue(name, value);
    setErrors((prevErrors) => ({
      ...prevErrors,
      [name]: errorMessages,
    }));
  };

  // 提交表单时触发校验
  const handleSubmit = (
    submitCallback: (result: {
      success: boolean;
      data?: Record<string, any>;
      errors?: Record<string, string[]>;
    }) => void
  ) => {
    const validationErrors: Record<string, string[]> = {};

    const getValueByPath = (obj: any, path: string) => {
      return path
        .split(/\.|\[|\]/)
        .filter(Boolean)
        .reduce((acc, key, index, array) => {
          if (!acc) return undefined;

          if (Array.isArray(acc)) {
            const matchKey = key;
            const matchedItem = acc.find((item) => item.key === matchKey);

            if (!matchedItem) return undefined;

            if (index === array.length - 1) {
              return matchedItem[key];
            }

            return matchedItem;
          }

          return acc[key];
        }, obj);
    };

    Object.keys(validationRules).forEach((name) => {
      const value = getValueByPath(values, name);

      // 添加校验前判断 values 中是否存在这个字段，比如 `hit_example[${el.key}].example`
      const keys = name.split(/\.|\[|\]/).filter(Boolean);
      let current = values;

      // 遍历 keys 检查是否存在
      let exists = true;
      for (let key of keys) {
        if (Array.isArray(current)) {
          const matchedItem = current.find((item) => item.key === key);
          if (!matchedItem) {
            exists = false;
            break;
          }
          current = matchedItem; // 移动到下一个层级
        } else {
          if (!(key in current)) {
            exists = false;
            break;
          }
          current = current[key]; // 移动到下一个层级
        }
      }

      // 如果字段存在，则进行校验逻辑
      if (exists) {
        const errorMessages = validateFieldValue(name, value);
        if (errorMessages.length > 0) {
          validationErrors[name] = errorMessages;
        }
      }
    });

    if (Object.keys(validationErrors).length === 0) {
      submitCallback({
        success: true,
        data: values,
      });
    } else {
      setErrors(validationErrors);
      submitCallback({
        success: false,
        errors: validationErrors,
      });
    }
  };

  const handleBlur = (
    e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    validateField(name, value);
  };

  return {
    values,
    errors,
    validationRules,
    setValues,
    setErrors,
    setValidationRules,
    handleChange,
    handleSubmit,
    handleBlur,
  };
}

```
### 总结
#### 实现功能
1. 表单数据可以由useFormValidation处理
2. 校验规则和useValidateField一样，通过自定义校验规则实现
    - maxLength 最大长度
    - minLength 最小长度
    - pattern 正则表达式
    - required 必填
    - custom 自定义校验规则，通过函数实现
``` tsx
const rules = {
    xxx:[
      { required: true, message: "xxx不能为空" },
      { maxLength: 500, message: "xxx长度不能超过500个字符" },
      { minLength: 10, message: "xxx长度不能小于10个字符" },
      { pattern: /^[a-zA-Z0-9]+$/, message: "xxx只能包含数字和字母" },
      function(value){
        return value.length > 100 ? "xxx长度不能超过100个字符" : "";
      },
    ]
}
```
3. 支持非链式校验：
    - 默认链式校验，当校验不通过时，会立即返回错误信息，不会继续校验其他规则；
    - 非链式校验，当校验不通过时，会继续校验其他规则，直到所有规则校验完毕，才会返回所有的错误信息；
4. 支持嵌套对象和数组
    - 如果需要校验的name是嵌套的字段，比如：`xxx.yyy.zzz`，则需要使用点分隔符（`.`）表示嵌套属性，使用方括号（`[]`）表示数组索引。
    - 例如：
        - 更新普通对象: name="name"
        - 更新嵌套对象: name="user.firstName"
        - 更新数组中的元素: name="0.value"
        - 更新嵌套数组中的元素: name="items[0].details[1].description"
5. 在Input等表单组件中使用name属性配合handleChange函数使用，可以实现受控，不需要手动解析实现字段更新；同时通过函数重载，支持字符串和事件对象两种方式。
6. 失去焦点校验和handleChange函数一样，支持字符串和事件对象两种方式。
7. 提供了handleSubmit函数，支持提交表单时触发校验，并返回校验结果。

#### 存在的问题
1. 解析嵌套对象和数组时，写法固定，比如：`xxx[0].yyy`。
2. 关于动态校验数据时，values里的字段需要手动更新setValues，且更新时需要手动添加响应的校验规则，移除时也需要手动移除values、校验规则，以及错误信息。
``` tsx
const handleAddExample = () => {
    const item = {
      key: generateUUID(8),
      example: "",
    };
    setValues({
      ...values,
      A_example: [...values.A_example, item],
    });
    setValidationRules((preRules) => {
      return {
        ...preRules,
        [`A_example[${item.key}].example`]: [
          { required: true, message: "示例不能为空" },
          { maxLength: 800, message: "示例长度不能超过800个字符" },
        ],
      };
    });
  };

  const handleDeleteExample = (el, index: number) => {
    setValues({
      ...values,
      A_example: values.A_example.filter((_, i) => i !== index),
    });

    // 移除错误信息
    setErrors((preErrors) => {
      const updatedErrors = { ...preErrors }; // 创建一个新的错误对象
      delete updatedErrors[`A_example[${el.key}].example`]; // 移除指定的错误信息
      return updatedErrors; // 返回更新后的错误对象
    });

    // 移除校验规则
    setValidationRules((preRules) => {
      const updatedRules = { ...preRules }; // 创建一个新的规则对象
      delete updatedRules[`A_example[${el.key}].example`]; // 移除指定的校验规则
      return updatedRules; // 返回更新后的规则对象
    });
  };

```
