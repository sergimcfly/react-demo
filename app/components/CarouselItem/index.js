import React, { Component, PropTypes } from 'react';

import {
  CarouselItemContainer,
  BookContainer,
  QuotesContainer,
  QuoteWrapper,
  Book,
  Quote,
  QuoteBy,
} from './styled';

class CarouselItem extends Component {
  static propTypes = {
    imgSrc: PropTypes.string.isRequired,
    praise: PropTypes.array.isRequired,
    description: PropTypes.string.isRequired,
  };

  state = { windowWidth: window.innerWidth }

  componentDidMount() {
    window.addEventListener('resize', () => this.setState({ windowWidth: window.innerWidth }));
  }

  componentWillUnmount() {
    window.removeEventListener('resize');
  }
  /* eslint-disable no-extra-boolean-cast */
  render() {
    const { imgSrc, praise, description } = this.props;
    const { windowWidth } = this.state;
    let substringCutoff = description.length;
    if (windowWidth <= 1100) substringCutoff = description.length / 2;
    if (windowWidth <= 900) substringCutoff = description.length / 3;
    if (windowWidth <= 600) substringCutoff = description.length / 4;
    if (windowWidth <= 400) substringCutoff = description.length / 8;
    return (
      <CarouselItemContainer>
        <BookContainer>
          <Book src={imgSrc} />
        </BookContainer>
        {!!praise.length ? <QuotesContainer>
          <QuoteWrapper>
            <Quote>{praise[0].quote}</Quote>
            <QuoteBy>{praise[0].quoteBy}</QuoteBy>
          </QuoteWrapper>
          {windowWidth > 970 && <QuoteWrapper>
            <Quote>{praise[1].quote}</Quote>
            <QuoteBy>{praise[1].quoteBy}</QuoteBy>
          </QuoteWrapper>}
          {windowWidth > 600 && <QuoteWrapper>
            <Quote>{praise[2].quote}</Quote>
            <QuoteBy>{praise[2].quoteBy}</QuoteBy>
          </QuoteWrapper>}
        </QuotesContainer> :
        <QuotesContainer>
          <Quote>{`${description.substring(0, substringCutoff)}...`}</Quote>
        </QuotesContainer>}
      </CarouselItemContainer>
    );
  }
}

export default CarouselItem;
