---
title: ts类型工具的练习
date: 2023-03-22 15:16:00
tags: [ts]
---
# ts 类型练习笔记

[https://www.tslang.cn/docs/home.html](https://www.tslang.cn/docs/home.html)

## [类型体操](https://typeroom.cn/problems/all)

一个非常好用的练习 ts 的网站

### 简单

1. 工具类型`Pink[T, K]`，假设我已经有一个类型`Person`,然后我只需要里面的`name`和`age`两个属性

```ts
interface Person {
  name: string;
  age: number;
  sex: string;
  contact: {
    phone: string;
    email: string;
  };
}

type NameAndContact = Pick<Person, "name" | "contact">;

// 手动模拟实现 Pick
// keyof T 返回的是T的所有 key 的联合类型
// K extends keyof T 意味着 K 必须是 T 的 key
type MyPick<T, K extends keyof T> = {
  // 遍历 K 的 key，并返回对应的 key 类型
  [P in K]: T[P];
};

// 当我们传入 Person 和 "name" | "contact" 时，首先会确认 "name" | "contact" 是 Person 的 key，然后返回一个对象类型，这个对象类型包含 "name" 和 "contact" 两个属性，属性类型分别是 Person 中对应的类型。
type NameAndContact = MyPick<Person, "name" | "contact">;
```

当这个属性是一个复杂的类型类型时，比如一个对象，那么这个对象里的属性也会被 Pick 出来,比如这里的`contact`

2. 工具类型 `Readonly[T]` ,将所有属性变为只读(不会递归)

```ts
interface Person {
  name: string;
  age: number;
  contact: {
    email: string;
    phone: string;
  };
}

type ReadonlyPerson = Readonly<Person>;
// 相当于
type ReadonlyPerson = {
  readonly name: string;
  readonly age: number;
  readonly contact: {
    email: string;
    phone: string;
  };
};

// 手动实现 Readonly
type MyReadonly<T> = {
  readonly [P in keyof T]: T[P];
};
```

3. 工具类型 `DeepReadonly<T>`，将所有属性变为只读(递归)

```ts
type DeepReadonlyPerson = DeepReadonly<Person>;
// 相当于
type DeepReadonlyPerson = {
  readonly name: string;
  readonly age: number;
  readonly contact: {
    readonly email: string;
    readonly phone: string;
  };
};

// 手动实现 DeepReadonly
type MyDeepReadonly<T> = {
  // 这里通过 T[P] extends object 来判断 T[P] 是否是一个对象类型
  // 如果是对象类型，那么就递归调用 MyDeepReadonly<T[P]>，否则就直接返回 T[P]
  readonly [P in keyof T]: T[P] extends object // 判断是否是对象类型
    ? T[P] extends Function // 判断是否是函数类型
      ? T[P] // 如果是函数类型，直接返回 T[P]
      : MyDeepReadonly<T[P]> // 如果是对象类型且不是函数，递归调用 MyDeepReadonly<T[P]>
    : T[P]; // 不是对象类型，直接返回 T[P]
};
```

4. 元组转对象

```ts
// tuple 类型 和数组类型的区别是长度固定
const tuple: [string, number, boolean] = ["name", 18, true];
// array 类型
const arr: any[] = ["name", 18, true];
// as const 断言，将 tuple 转换为 readonly [string, number, boolean]
const tuple: [string, number, boolean] = ["name", 18, true] as const;
// 相当于，表示 tuple 是一个只读的元组类型
const tuple: readonly [string, number, boolean] = ["name", 18, true];

// 这里 使用 readonly 将 tuple 转换为 readonly (string | number | boolean)[],表示 tuple 是一个只读的元组类型
type TupleToObject<T extends readonly (string | symbol | number)[]> = {
  [P in T[number]]: P;
};
```

5.  写一个 `First<T>`,返回数组的第一个元素类型

```ts
// infer 用于提取类型 ，这里提取数组的第一个元素类型并命名为F
type First<T extends any[]> = T extends [infer F, ...any[]] ? F : never;

// 下面这种 不适用与联合类型 （例如 T = [] | [string]）
type First<T extends any[]> = T extends [] ? never : T[0];
```

6. 写一个 `Length<T>`,返回元组的长度

```ts
type Length<T extends readonly (string | number | symbol)[]> = T["length"];
```

7. 实现内置的工具类型 `Exclude<T, U>`,`Exclude` 的作用是从 T 中排除 U

```ts
// Exclude<T, U> 的作用是从 T 中排除 U
type Exclude<"a" | "b" | "c", "a">; // "b" | "c"

// 当条件类型作用于泛型类型时，它们在给定联合类型时变得具有分配性
type MyExclude<T, U> = T extends U ? never : T;
// 举例说明
type Anis = 'dog'|'cat'|'pig'
type Anis2 = 'cat'|'horse'
type Res = MyExclude<Anis, Anis2>
// 相当于
type Res =  ('dog' extends Anis2)? never :  'dog'|
            ('cat' extends Anis2)? never :  'cat'|
            ('pig' extends Anis2)? never :  'pig'
// 最终结果为 'dog' | never |'pig' ,而never是不会出现在联合类型中的，所以最终结果为 'dog' | 'pig'

```

8. 实现内置工具函数`Awaited`，用于获取 Promise 的返回值类型

```ts
type Awaited<T>

// 接收一个 泛型T ，如果 T 是 PromiseLike 类型，拿到 PromiseLike 的泛型参数 F，判断 F 是否是 PromiseLike 类型，如果是，则递归调用 Awaited<F>，否则返回 F 如果T 不是 PromiseLike 类型，则返回 never
type MyAwaited<T extends PromiseLike<any>> = T extends PromiseLike<infer F>
?(F extends PromiseLike<any>
    ? MyAwaited<F>
    : F)
: never
```

9. 实现 工具类型 `If<C,T,F>`,根据条件 C 的真假返回类型 T 或 F

```ts
// 当 TS config中配置项为strictNullChecks：false 时，null 和 undefined 可以赋值给任何类型，所以需要 先 排除 null 和 undefined
type If<C extends boolean, T, F> = C extends null | undefined
  ? never
  : C extends true
  ? T
  : F;
```

10. 实现 `Concat<T, U>`，用于将两个数组类型连接在一起，返回一个新的数组类型

```ts
// 使用 any 不管什么类型都可以但是后续使用该类型的时候不会触发类型检测
type Concat<T extends any[], U extends any[]> = [...T, ...U];
// unknown表示未知类型，后续使用该类型的时候会触发类型检测，必须断言
type Concat<T extends unknown[], U extends unknown[]> = [...T, ...U];
```
