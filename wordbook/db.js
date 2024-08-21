let db;

init();

async function init() {
  db = await idb.openDb('WordsDb', 1, db => {
    db.createObjectStore('Words', {keyPath: 'name'});
  });
  list()
}

async function list() {
  let tx = db.transaction('Words');
  let WordStore = tx.objectStore('Words');

  let Words = await WordStore.getAll();

  if (Words.length) {
    bookmarks.innerHTML = Words.map(Word => cardHTML(Word, true)).join('');
  } else {
    bookmarks.innerHTML = '<p class="text-center">No Words yet. Please <a href="/">go back</a> and add some words'
  }
}

async function clearWords() {
  let tx = db.transaction('Words', 'readwrite');
  await tx.objectStore('Words').clear();
  await list();
}

async function addWord(event) {

  let target = event.target
  let container = target.parentElement

  let name = container.getElementsByTagName("H5")[0].innerHTML;
  let phonetic = container.getElementsByTagName("H5")[1].innerHTML
  let origin = container.getElementsByTagName("P")[0].innerHTML
  let audio = container.getElementsByTagName("DIV")[0].dataset.audioUrl

  let tx = db.transaction('Words', 'readwrite');

  let transactionResult = true;

  try {
    await tx.objectStore('Words').add({name, phonetic, origin, audio});
    toastList[3].show()
  } catch(err) {
    if (err.name == 'ConstraintError') {
      toastList[2].show()
      transactionResult = false;
    } else {
      throw err;
    }
  } finally {
    if (transactionResult) {
      event.target.innerHTML = 'remove bookmark'
      event.target.classList.add('btn-dark');
    }
  }

}

async function deleteWord(event) {

  let name = event.target.parentElement.getElementsByTagName("H5")[0].innerHTML;

  let tx = db.transaction('Words', 'readwrite');
  await tx.objectStore('Words').delete(name);
  toastList[4].show()
  // change style
  event.target.innerHTML = 'bookmark'
  event.target.classList.remove('btn-dark');
  await list();
}

window.addEventListener('unhandledrejection', event => {
  alert("Error: " + event.reason.message);
});