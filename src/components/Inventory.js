import React from 'react';
import AddFishForm from './AddFishForm';
import base from '../base';

class Inventory extends React.Component {
  constructor() {
    super();
    this.renderInventory = this.renderInventory.bind(this);
    this.renderLogin = this.renderLogin.bind(this);
    this.authenticate = this.authenticate.bind(this);
    this.authHandler = this.authHandler.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.logout = this.logout.bind(this);

    this.state = {
      uid: null,
      owner: null
    }
  }

  componentDidMount() {
    base.onAuth((user) => {
      if(user) {
        this.authHandler(null, { user })
      }
    });
  }

  handleChange(e, key) {
    const fish = this.props.fishes[key];
    const updatedFish = {...fish};
    updatedFish[e.target.name] = e.target.value;
    this.props.updateFish(key, updatedFish);
  }

  renderInventory(key) {
    // We're going to need the fish information here, so:
    const fish = this.props.fishes[key];

    return (
      <div className="fish-edit" key={key}>
        <input type="text" name="name" value={fish.name} placeholder="Fish name" onChange={ (e) => this.handleChange(e, key) }/>
        <input type="text" name="price" value={fish.price} placeholder="Fish price"  onChange={ (e) => this.handleChange(e, key) }/>
        <select type="text" name="status" value={fish.status} placeholder="Fish status"  onChange={ (e) => this.handleChange(e, key) }>
          <option value="available">Fresh!</option>
          <option value="unavailable">Out of Stock</option>
        </select>
        <textarea type="text" name="desc" value={fish.desc} placeholder="Fish desc" onChange={ (e) => this.handleChange(e, key) }></textarea>
        <input type="text" name="image" value={fish.image} placeholder="Fish image" onChange={ (e) => this.handleChange(e, key) }/>
        <button onClick={ () => this.props.removeFish(key) }>Remove Fish</button>
      </div>
    )
  }

  renderLogin() {
    return (
      <nav className="login">
        <h2>Inventory</h2>
        <button className="github" onClick={ () => this.authenticate('github')}>Log in with GitHub</button>
        <button className="facebook" onClick={ () => this.authenticate('facebook')}>Log in with Facebook</button>
        <button className="twitter" onClick={ () => this.authenticate('twitter')}>Log in with Twitter</button>
      </nav>
    )
  }

  authenticate(provider) {
    base.authWithOAuthPopup(provider, this.authHandler);
  }

  authHandler(err, authData) {
    console.log(authData);

    if(err){
      console.error(err);
      return;
    }

    // Grab the store info
    const storeRef = base.database().ref(this.props.storeId);

    // Query firebase for our individual store data
    storeRef.once('value', (snapshot) => {
      const data = snapshot.val() || {};

      // If there's no owner, there will be now!
      if(!data.owner) {
        storeRef.set({
          owner: authData.user.uid
        });

      }

      // Now we set thing up on our local state as well
      this.setState({
        // User is our logged user
        uid: authData.user.uid,

        // Owner is whoever was, or the current user
        owner: data.owner || authData.user.uid
      })
    })
  }

  logout() {
    base.unauth();
    this.setState({ uid: null });
  }

  render() {
    const logout = <button onClick={this.logout}>Log Out</button>;

    // First we check if the user is logged in.
    // If not, of course we return the login interface
    if(!this.state.uid) {
      return <div>{this.renderLogin()}</div>
    }

    // Then we check to see if the logged in user is the storeowner
    // If not, we show a warning
    if(this.state.uid !== this.state.owner) {
      return (
        <div>
          <h2>Inventory</h2>
          <p>Stop trying to manage a store you're not an owner to!</p>
          {logout}
        </div>
      )
    }

    // Only when the local user (this.state.uid) is the same as the
    // store owner (pulled from firebase) is the actual Inventory shown
    return (
      <div>
        <h2>Inventory</h2>
        {Object.keys(this.props.fishes).map(this.renderInventory)}
        <AddFishForm addFish={this.props.addFish}/>
        <button onClick={this.props.loadSamples}>Load Sample Fishes</button>
        {logout}
      </div>
    )
  }
}

Inventory.propTypes = {
  storeId: React.PropTypes.string.isRequired,
  fishes: React.PropTypes.object.isRequired,
  updateFish: React.PropTypes.func.isRequired,
  addFish: React.PropTypes.func.isRequired,
  removeFish: React.PropTypes.func.isRequired,
  loadSamples: React.PropTypes.func.isRequired
}

export default Inventory;
