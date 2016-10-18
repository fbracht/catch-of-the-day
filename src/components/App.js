import React from 'react';
import base from '../base';
import Header from './Header';
import Fish from './Fish';
import Order from './Order';
import Inventory from './Inventory';
import sampleFishes from '../sample-fishes';

class App extends React.Component {
  /* LIFECYCLE METHODS */
  constructor() {
    super();

    this.addFish = this.addFish.bind(this);
    this.updateFish = this.updateFish.bind(this);
    this.removeFish = this.removeFish.bind(this);
    this.addToOrder = this.addToOrder.bind(this);
    this.removeFromOrder = this.removeFromOrder.bind(this);
    this.loadSamples = this.loadSamples.bind(this);

    // getInitialState
    this.state = {
      fishes: {},
      order: {}
    }
  }

  componentWillMount() {
    this.ref = base.syncState(`${this.props.params.storeId}/fishes`,
    {
      context: this,
      state: 'fishes'
    });

    const localStorageRef = localStorage.getItem(`order-${this.props.params.storeId}`);

    if(localStorageRef) {
      this.setState({ order: JSON.parse(localStorageRef) });
    }
  }

  componentWillUnmount() {
    base.removeBinding(this.ref);
  }

  componentWillUpdate(nextProps, nextState) {
    localStorage.setItem(
      `order-${this.props.params.storeId}`,
      JSON.stringify(nextState.order)
    );
  }

  /* CUSTOM METHODS */
  loadSamples() {
    this.setState({ fishes: sampleFishes });
  }

  addFish(fish) {
    // MANIPULATING STATE #tips
    // First we make a copy of our state...
    const fishes = {...this.state.fishes};
    // ...pull a stimestamp to make every fish key unique...
    const timestamp = Date.now();
    // ...include our new received fish as a new key on top of the copied state:
    fishes[`fish-${timestamp}`] = fish;
    // ...then finally update the fishes state;
    this.setState({ fishes: fishes });
  }

  updateFish(key, updatedFish) {
    const fishes = {...this.state.fishes};
    fishes[key] = updatedFish;
    this.setState({ fishes });
  }

  removeFish(key) {
    const fishes = {...this.state.fishes};
    fishes[key] = null; // This is the way to 'remove' from Firebase #tips
    this.setState({ fishes });
  }

  addToOrder(key) {
    // Repeating what we did above!
    const order = {...this.state.order};
    order[key] = order[key] + 1 || 1;
    this.setState({ order: order });
  }

  removeFromOrder(key) {
    const order = {...this.state.order};
    // Since we're only removing from localStorage, we can simply delete instead of setting to null like on our fishes state #tips
    delete order[key]
    this.setState({ order })
  }

  render() {
    return (
      <div className="catch-of-the-day">
        <div className="menu">
          <Header tagline="Rating: Awesome"/>
          <ul className="list-of-fishes">
            {
              Object.keys(this.state.fishes)
                .map(key =>
                  <Fish
                    key={key}
                    fishkey={key}
                    details={this.state.fishes[key]}
                    addToOrder={this.addToOrder}
                  />
                )
            }
          </ul>
        </div>
        <Order
          fishes={this.state.fishes}
          order={this.state.order}
          params={this.props.params}
          removeFromOrder={this.removeFromOrder}
        />
        <Inventory
          fishes={this.state.fishes}
          addFish={this.addFish}
          removeFish={this.removeFish}
          loadSamples={this.loadSamples}
          updateFish={this.updateFish}
          storeId={this.props.params.storeId}
        />
      </div>
    )
  }
}

App.propTypes = {
  params: React.PropTypes.object.isRequired

}

export default App;
