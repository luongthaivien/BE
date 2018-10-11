export const resSuccess = (res, data) => {
  res.status(200).send({
    success: true,
    payload: data
  });
};
export const resError = (res, err) => {
  res.status(200).send({
    success: false,
    payload: err
  });
};

export const resErrorNotFoundObject = (res, objectId) => {
  res.status(200).send({
    success: false,
    payload: {
      code: 404,
      message: `Not found object with id ${objectId}`
    }
  });
};
