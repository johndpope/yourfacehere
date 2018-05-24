import React from 'react';
import PropTypes from 'prop-types';
import Button from 'material-ui/Button';
import Popover from 'material-ui/Popover';
import Typography from 'material-ui/Typography';
import {withStyles} from 'material-ui/styles';
import copy from 'copy-to-clipboard';
import { findDOMNode } from 'react-dom';
import {ShareButtons, generateShareIcon} from 'react-share';

const {
  FacebookShareButton,
  TwitterShareButton,
  EmailShareButton,
  RedditShareButton,
  WhatsappShareButton,
} = ShareButtons;

const FacebookIcon = generateShareIcon('facebook');
const TwitterIcon = generateShareIcon('twitter');
const EmailIcon = generateShareIcon('email');
const RedditIcon = generateShareIcon('reddit');
const WhatsappIcon = generateShareIcon('whatsapp');


const styles = {
  copiedStyle: {
    margin: '10px 20px'
  },
  shareIconContainer: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
  },
  shareIcon: {
    cursor: 'pointer',
    padding: '10px'
  },
  wrapper: {
    padding: '20px 0',
    textAlign: 'center'

  }
}
class ShareIcons extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      isCopiedOpen: false,
      popoverAnchor: null,
    }
  }

  copyUrl() {
    copy(this.props.url)
    this.setState({isCopiedOpen: true, popoverAnchor: findDOMNode(this.copyButton)})
  }

  handleCopyClose() {
    this.setState({isCopiedOpen: false})
  }

  copyButton = null;

  render() {
    const {classes, url} = this.props;
    return (
      <div className={classes.wrapper}>
         <div className={classes.shareIconContainer}>
            <FacebookShareButton className={classes.shareIcon} url={url}><FacebookIcon size={32} round={true} /></FacebookShareButton>
            <TwitterShareButton className={classes.shareIcon} url={url}><TwitterIcon  size={32} round={true} /></TwitterShareButton>
            <EmailShareButton className={classes.shareIcon} url={url}><EmailIcon  size={32} round={true} /></EmailShareButton>
            <RedditShareButton className={classes.shareIcon} url={url}><RedditIcon  size={32} round={true} /></RedditShareButton>
            <WhatsappShareButton className={classes.shareIcon} url={url}><WhatsappIcon  size={32} round={true} /></WhatsappShareButton>
            <Button ref={node => {
              this.copyButton = node;
            }}
              onClick={this.copyUrl.bind(this)}
              raised
              color="primary"
              >Copy
            </Button>
          </div>


          <Popover 
            open={this.state.isCopiedOpen} 
            anchorEl={this.state.popoverAnchor}
            anchorOrigin={{
              vertical: 'bottom',
              horizontal: 'center',
            }}
            onClose={this.handleCopyClose.bind(this)}
          >
            <Typography className={classes.copiedStyle}>{`Copied to your clipboard!`}</Typography>
          </Popover>
      </div>  
    )
  }
}

ShareIcons.propTypes = {
  url: PropTypes.string.isRequired
}

export default withStyles(styles)(ShareIcons);
