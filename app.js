window.indexedDB =
  window.indexedDB ||
  window.mozIndexedDB ||
  window.webkitIndexDB ||
  window.msIndexedDB;

if (!window.indexedDB) {
  alert("No indexedDB");
}

let request = window.indexedDB.open("QuizQuestDatabase", 1),
  db, // database
  tx, //  transaction
  store,
  index;

request.onupgradeneeded = function (e) {
  let db = request.result,
    store = db.createObjectStore("QuestionsStore", {
      keyPath: "qID",
    }),
    //   store = db.createObjectStore("QuestionsStore", {
    //       autoIncrement: true
    //   })
    index = store.createIndex("questionText", "questionText", {
      unique: false,
    });
};

request.onerror = function (e) {
  console.log("There was an error: " + request.error);
};

request.onsuccess = function (e) {
  db = request.result;
  tx = db.transaction("QuestionsStore", "readwrite");
  store = tx.objectStore("QuestionsStore");
  index = store.index("questionText");

  db.onerror = function (e) {
    console.log("ERROR" + e.target.errorCode);
  };

  // Add data to the store
  store.put({
    qID: 1,
    questionText: "The sky is blue.",
    correctAnswer: true,
    studentAnswer: true,
    result: true,
  });
  store.put({
    qID: 2,
    questionText: "The grass is green.",
    correctAnswer: true,
    studentAnswer: true,
    result: true,
  });

  // Retrieve data from the store
  let question1 = store.get(1); // get data from primary key (keyPath: "qID")
  let question2 = index.get("The grass is green."); // get data from index key (keyPath: "questionText")

  // IndexedDB is asynchronous
  question1.onsuccess = function () {
    console.log("Question 1", question1.result);
    console.log("Question 1", question1.result.questionText);
  };
  question2.onsuccess = function () {
    console.log("Question 2", question2.result);
    console.log("Question 2", question2.result.questionText);
  };

  tx.oncomplete = function () {
    db.close();
  };
};
