import React from 'react';
import { formatPrice } from '../helpers';

class Fish extends React.Component {
  render() {
    const { details, fishkey } = this.props;
    const isAvailable = details.status === 'available';
    const buttonText = isAvailable ? 'Add to Order' : 'Vacilou perdeu';

    return (
      <li className="menu-fish">
        <img src={details.image} alt={details.name}/>
        <h3 className="fish-name">
          {details.name}
          <span className="price">{formatPrice(details.price)}</span>
        </h3>
        <p>{details.desc}</p>
        <button
          disabled={!isAvailable}
          onClick={() => this.props.addToOrder(fishkey)}>
          {buttonText}
        </button>
      </li>
    )
  }
}

Fish.propTypes = {
  addToOrder: React.PropTypes.func.isRequired,
  details: React.PropTypes.object.isRequired,
  fishkey: React.PropTypes.string.isRequired
}

export default Fish;
