let userObj = {
  username: "ellie",
  grade: 100,
  password: "pass123",
  isConnected: true,
  address: {
    country: "Israel",
    city: "kash",
    street: "ben gurion 10",
  },
  allGrades: [{ csharp: 90 }, { cpp: 70 }, 100, 80, 90, 85],
};

let newGrade = userObj.grade + 10;
userObj.grade += 10;
userObj.id = 1000; //adding the id element to userObj dict

let userObj2 = userObj;
userObj.grade += 10;
userObj2.grade = 0;
let grade1 = userObj.grade;

userObj.address.street = ""; //if street doesnt exist - it'll be created here
userObj["address"].city = "tel aviv";

let arr = [
  userObj,
  {
    username: "ellie",
    grade: 100,
    password: "pass123",
    isConnected: true,
    address: {
      country: "Israel",
      city: "kash",
      street: "ben gurion 10",
    },
    allGrades: [{ csharp: 90 }, { cpp: 70 }, 100, 80, 90, 85],
  },
];

arr[0].allGrades[1] = { CPP: 80 }; //changes the userObj allGrades
arr[1].avg = 95;

let user2 = arr[1];
user2.password = "12345";
