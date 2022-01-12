function safelyClearSelectedMetadata() {
    try {
      clearSelectedMetadata()
    } catch(e) {
      console.warn('could not clear data', e);
    }
  }