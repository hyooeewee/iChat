const formatMsgTime = (date: string) => {
  return new Date(date).toLocaleTimeString('en-Us', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  });
};

export default formatMsgTime;
