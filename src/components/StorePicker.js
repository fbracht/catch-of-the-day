import React from 'react';
import {getFunName} from '../helpers';

class StorePicker extends React.Component {
  // constructor() {
  //   super();
  //
  //   // The next line makes it possible to
  //   // use `this` inside of the goToStore method
  //   this.goToStore = this.goToStore.bind(this);
  // }
  //
  // This is all commented for reference: it can be done this way instead of the way it was done in line 24. If it was being done this way, we would have used a simple {this.goToStore} on the submit event listener.

  goToStore(e) {
    e.preventDefault();
    const storeId = this.storeInput.value;
    this.context.router.transitionTo(`/store/${storeId}`);
    // equivalent to:               ('store/' + storeId);
  }

  render() {
    return (
      <form
        className="store-selector"
        onSubmit={ (e) => {this.goToStore(e)} }
      >
        <h2>Please Enter a Store</h2>
        <input
          required
          type="text"
          placeholder="Store Name"
          defaultValue={getFunName()}
          ref={ (value) => {this.storeInput = value} }
          /* value can be whatever! */
        />
        <button type="submit">Visit Store ➡️</button>
      </form>
    )
  }
}

// I have no idea how, but this surfaces the router using context, so that we can access the transitionTo function on the goToStore method
StorePicker.contextTypes = {
  router: React.PropTypes.object
}

export default StorePicker;
