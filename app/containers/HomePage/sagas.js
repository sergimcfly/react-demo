import { call, put, select, takeLatest } from 'redux-saga/effects';

import request, { fetchAll } from 'utils/request';
import { extractPraises, parsePraises, combineBookData, removeSymbols } from 'utils/helpers';
import { apiKey, authorId } from '../../../secrets';
import { GET_BOOKS } from './constants';
import { setBooks, setPraise, setDescription } from './actions';
import { selectPraise, selectDescription } from './selectors';

export function* getBooks() {
  const titlesURL = `https://api.penguinrandomhouse.com/resources/v2/title/domains/PRH.US/authors/${authorId}/titles?rows=0&api_key=${apiKey}`;
  try {
    const titlesResult = yield call(request, titlesURL);
    const viewURLs = titlesResult.data.titles.map((title) => `https://api.penguinrandomhouse.com/resources/v2/title/domains/PRH.US/titles/${title.isbn}/views/product-display?suppressLinks=true&api_key=${apiKey}`);
    const viewPromises = viewURLs.map((url) => request(url));
    const viewResults = yield call(fetchAll, viewPromises);
    for (let i = 0; i < viewResults.length; i += 1) {
      yield put(setDescription(viewResults[i].params.isbn, removeSymbols(viewResults[i].data.frontlistiestTitle.aboutTheBook)));
      yield put(setPraise(viewResults[i].params.isbn, parsePraises(extractPraises(viewResults[i].data.praises))));
    }
    const praiseInState = yield select(selectPraise());
    const descriptionInState = yield select(selectDescription());
    const booksAndPraise = combineBookData(titlesResult.data.titles, praiseInState, descriptionInState);
    yield put(setBooks(booksAndPraise));
  } catch (err) {
    console.error(err);
  }
}

// Root saga
export default function* rootSaga() {
  yield [
    takeLatest(GET_BOOKS, getBooks),
  ];
}
