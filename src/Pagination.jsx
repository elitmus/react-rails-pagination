import React from 'react';
import PropTypes from 'prop-types';
import './index.css.scss';

class Pagination extends React.Component {
  constructor(props) {
    super(props);
    const { page } = this.props;

    this.path = this.getCustomizedParamsPath();
    this.state = { page: parseInt(page) };
  }

  static getDerivedStateFromProps(props) {
    return {
      page: props.page,
    };
  }

  getAdditionalClasses() {
    const { outline, color } = this.props;
    const prefix = 'rails-pagination';
    let classes = '';
    if (outline) classes += '-outline';

    if (color) classes += `-${color}`;

    if (classes) classes = prefix + classes;

    return classes;
  }

  getCustomizedParamsPath() {
    const { params, path } = this.props;
    let customParams = '';

    Object.keys(params).forEach((param) => {
      customParams += `${param}=${params[param]}`;
    });

    if (customParams === '') {
      const headerParams = new URLSearchParams(window.location.search);
      headerParams.delete('page');
      customParams = headerParams.toString();
    }

    customParams = customParams === '' ? '?page=' : `?${customParams}&page=`;

    return `${path}${customParams}`;
  }

  changePage(event, pagePath, pageNumber) {
    const { handleChangePage } = this.props;
    event.preventDefault();
    if (window.history.pushState) {
      window.history.pushState('Update from React Pagination', document.title, pagePath);
    } else {
      document.location.href = pagePath;
    }
    handleChangePage(pageNumber);
  }

  paginationElement(number, index) {
    const displayName = number;
    const { page } = this.state;
    const { pages, params } = this.props;

    let pageNumber = number;
    let canClick = true;

    switch (pageNumber) {
    case 'Prev':
      pageNumber = page - 1;
      if (page === 1) {
        canClick = false;
      }
      break;
    case 'Next':
      pageNumber = page + 1;
      if (page === pages) {
        canClick = false;
      }
      break;
    case '...':
      canClick = false;
      break;
    case '<<':
      pageNumber = 1;
      break;
    case '>>':
      pageNumber = pages;
      break;
    default:
    }

    if (pageNumber === page && (displayName === '>>' || displayName === '<<')) {
      canClick = false;
    }

    const pagePath = canClick ? `${this.getCustomizedParamsPath(params)}${pageNumber}` : '';

    return (
      <li key={index} className={number === page ? 'active' : 'inactive'}>
        <a
          href={pagePath}
          className={`${canClick ? '' : 'disabled'} ${displayName === '...' ? 'separator' : ''}`}
          onClick={(e) => this.changePage(e, pagePath, pageNumber)}
        >
          {displayName}
        </a>
      </li>
    );
  }

  render() {
    const self = this;
    const { page } = self.state;
    const lastPage = self.props.pages;
    const { hideEndArrows, hideNavButtons } = self.props;
    const pageLinks = [];
    const maxElements = 3;
    const edgeElementCount = 3;
    const renderedPages = [];
    const additionalClass = self.getAdditionalClasses();
    for (let i = page - maxElements; i <= page + maxElements; i += 1) {
      if (!renderedPages.includes(i)) renderedPages.push(i);
    }

    if ((lastPage - renderedPages[renderedPages.length - 1]) >= edgeElementCount) {
      renderedPages.push('...');
      renderedPages.push(lastPage - 1);
      renderedPages.push(lastPage);
    } else {
      for (let i = renderedPages[renderedPages.length - 1] + 1; i <= lastPage; i += 1) {
        if (!renderedPages.includes(i)) renderedPages.push(i);
      }
    }

    if ((renderedPages[0] - 1) > edgeElementCount) {
      renderedPages.unshift('...');
      renderedPages.unshift(2);
      renderedPages.unshift(1);
    } else {
      for (let i = renderedPages[0] - 1; i >= 1; i -= 1) {
        if (!renderedPages.includes(i)) renderedPages.unshift(i);
      }
    }

    if (!hideNavButtons) {
      renderedPages.unshift('Prev');
      renderedPages.push('Next');
    }

    if (!hideEndArrows) {
      renderedPages.unshift('<<');
      renderedPages.push('>>');
    }

    renderedPages.forEach((singlePage, index) => {
      if ((singlePage > 0 && singlePage <= lastPage) || singlePage === '...' || singlePage === 'Prev' || singlePage === 'Next' || singlePage === '>>' || singlePage === '<<') pageLinks.push(self.paginationElement(singlePage, index));
    });

    return (
      <ul className={`rails-pagination ${additionalClass}`}>
        {pageLinks}
      </ul>
    );
  }
}

Pagination.propTypes = {
  page: PropTypes.number.isRequired,
  pages: PropTypes.number.isRequired,
  handleChangePage: PropTypes.func.isRequired,
  path: PropTypes.string,
  params: PropTypes.object,
  hideEndArrows: PropTypes.bool,
  hideNavButtons: PropTypes.bool,
  outline: PropTypes.bool,
  color: PropTypes.string,
};

Pagination.defaultProps = {
  path: '',
  params: {},
  hideEndArrows: false,
  hideNavButtons: false,
  outline: false,
  color: '',
};

export default Pagination;
