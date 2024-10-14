interface Person {
  name: string;
  age: number;
  contact: {
    email: string;
    phone: string;
  };
}

type ReadonlyPerson = Readonly<Person>;

const person: ReadonlyPerson = {
  name: "张三",
  age: 18,
  contact: {
    email: "123@qq.com",
    phone: "123456789",
  },
};

person.contact.email = "456@qq.com"; // 可以修改
// person.age = 20; // 无法为“age”赋值，因为它是只读属性


const a:Function = ()=>{}