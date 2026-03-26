const strada = {
  enabled: Boolean(window?.Strada || window?.webkit?.messageHandlers),
  dispatch(eventName, payload = {}) {
    if (window?.Strada?.dispatch) {
      window.Strada.dispatch(eventName, payload);
    }
  },
};

export default strada;
