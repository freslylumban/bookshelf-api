/* eslint-disable linebreak-style */
/* eslint-disable max-len */
/* eslint-disable eqeqeq */
/* eslint-disable no-param-reassign */
/* eslint-disable no-return-assign */
const { nanoid } = require('nanoid');
const books = require('./books');

const addBookHandler = (request, h) => {
  const {
    name, year, author, summary, publisher, pageCount, readPage, reading,
  } = request.payload;

  const id = nanoid(16);
  const insertedAt = new Date().toISOString();
  const updatedAt = insertedAt;
  const finished = (readPage === pageCount);

  if (name == null || name === '') {
    const response = h.response({
      status: 'fail',
      message: 'Gagal menambahkan buku. Mohon isi nama buku',
    });
    response.code(400);
    return response;
  }

  if (readPage > pageCount) {
    const response = h.response({
      status: 'fail',
      message: 'Gagal menambahkan buku. readPage tidak boleh lebih besar dari pageCount',
    });
    response.code(400);
    return response;
  }

  const newBooks = {
    id, name, year, author, summary, publisher, pageCount, readPage, reading, finished, insertedAt, updatedAt,
  };

  books.push(newBooks);

  const isSuccess = books.filter((book) => book.id === id).length > 0;

  if (isSuccess) {
    const response = h.response({
      status: 'success',
      message: 'Buku berhasil ditambahkan',
      data: {
        bookId: id,
      },
    });
    response.code(201);
    return response;
  }

  const response = h.response({
    status: 'fail',
    message: 'Buku gagal ditambahkan',
  });
  response.code(500);
  return response;
};

const getAllBooksHandler = (request) => {
  const nameQuery = request.query.name;

  const isReadingQuery = request.query.reading;

  const isFinishQuery = request.query.finished;

  if (nameQuery) {
    const filterRegex = /dicoding/i;
    return {
      status: 'success',
      data: {
        books: books
          .filter((book) => book.name.match(filterRegex))
          .map(({ id, name, publisher }) => ({ id, name, publisher })),
      },
    };
  }

  if (isReadingQuery === 1 || isReadingQuery === '1') {
    return {
      status: 'success',
      data: {
        books: books
          .filter((book) => book.reading === true)
          .map(({ id, name, publisher }) => ({ id, name, publisher })),
      },
    };
  }

  if (isReadingQuery === 0 || isReadingQuery === '0') {
    return {
      status: 'success',
      data: {
        books: books
          .filter((book) => book.reading === false)
          .map(({ id, name, publisher }) => ({ id, name, publisher })),
      },
    };
  }

  if (isFinishQuery === 1 || isFinishQuery === '1') {
    return {
      status: 'success',
      data: {
        books: books
          .filter((book) => book.finished === true)
          .map(({ id, name, publisher }) => ({ id, name, publisher })),
      },
    };
  }

  if (isFinishQuery === 0 || isFinishQuery === '0') {
    return {
      status: 'success',
      data: {
        books: books
          .filter((book) => book.finished === false)
          .map(({ id, name, publisher }) => ({ id, name, publisher })),
      },
    };
  }

  return {
    status: 'success',
    data: {
      books: books.map(({ id, name, publisher }) => ({ id, name, publisher })),
    },
  };
};

const getBookByIdHandler = (request, h) => {
  const { id } = request.params;

  const book = books.filter((n) => n.id === id)[0];

  if (book !== undefined) {
    return {
      status: 'success',
      data: {
        book,
      },
    };
  }

  const response = h.response({
    status: 'fail',
    message: 'Buku tidak ditemukan',
  });
  response.code(404);
  return response;
};

const editBookByIdHandler = (request, h) => {
  const { id } = request.params;
  const {
    name, year, author, summary, publisher, pageCount, readPage, reading,
  } = request.payload;
  const updatedAt = new Date().toISOString();
  const index = books.findIndex((book) => book.id === id);

  if (name == null || name === '') {
    const response = h.response({
      status: 'fail',
      message: 'Gagal memperbarui buku. Mohon isi nama buku',
    });
    response.code(400);
    return response;
  }

  if (readPage > pageCount) {
    const response = h.response({
      status: 'fail',
      message: 'Gagal memperbarui buku. readPage tidak boleh lebih besar dari pageCount',
    });
    response.code(400);
    return response;
  }

  if (index !== -1) {
    books[index] = {
      ...books[index],
      name,
      year,
      author,
      summary,
      publisher,
      pageCount,
      readPage,
      reading,
      updatedAt,
    };

    const response = h.response({
      status: 'success',
      message: 'Buku berhasil diperbarui',
    });
    response.code(200);
    return response;
  }

  const response = h.response({
    status: 'fail',
    message: 'Gagal memperbarui buku. Id tidak ditemukan',
  });
  response.code(404);
  return response;
};

const deleteBookByIdHandler = (request, h) => {
  const { id } = request.params;

  const index = books.findIndex((book) => book.id === id);

  if (index !== -1) {
    books.splice(index, 1);
    const response = h.response({
      status: 'success',
      message: 'Buku berhasil dihapus',
    });
    response.code(200);
    return response;
  }

  const response = h.response({
    status: 'fail',
    message: 'Buku gagal dihapus. Id tidak ditemukan',
  });
  response.code(404);
  return response;
};

module.exports = {
  addBookHandler, getAllBooksHandler, getBookByIdHandler, editBookByIdHandler, deleteBookByIdHandler,
};
