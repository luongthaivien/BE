export const pad =
  (value,
   length) => (
    (value.toString().length < length) ?
      pad(`0${value}`, length
      )
      : value
  );

export const getFewContent = (content = '', numberOfWords = 10) => {
  const str = `${content.split(/\s+/).slice(0, numberOfWords).join(' ')}`;
  return str.length > 50 ? str.substr(0, 50) : str;
};
export const getFewContentFromHTML = (content = '', numberOfWords = null) => {
  content = content.replace(/<(?:.|\n)*?>/gm, '');
  if (numberOfWords === null) return content;
  const num = numberOfWords || 50;
  const str = `${content.split(/\s+/).slice(0, num).join(' ')}`;
  return str.length > 50 ? str.substr(0, 50) : str;
};
export default getFewContent;
