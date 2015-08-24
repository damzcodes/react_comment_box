

var CommentBox = React.createClass({
  
  loadCommentsFromServer: function() {
     $.ajax({
      url: this.props.url,
      dataType: 'json',
      success: function(data) {
        this.setState({data: data});
      }.bind(this),
      error: function(xhr, status, err) {
        console.error(this.props.url, status, err.toString());
      }.bind(this)
    });
  },

  handleCommentSubmit: function(comment) {
    var comments = this.state.data;
    var newComments = comments.concat([comment]);
    this.setState({data: newComments});
    return;
    $.ajax({
      url: this.props.url,
      dataType: 'json',
      type: 'POST',
      data: comment,
      success: function(data) {
        this.setState({data: data});
      }.bind(this),
      error: function(xhr, status, err) {
        console.error(this.props.url, status, err.toString());
      }.bind(this)
    });
  },

  componentDidMount: function() {
   this.loadCommentsFromServer();
  },

  getInitialState: function() {
    return {data: []};
  },

  render: function() {
    return (
      <div className="container">
        <div className="row">
          <div className="commentBox col-md-12">
            <h1 className="text-center">Comments</h1>
            <CommentList data={this.state.data} />
            <CommentForm onCommentSubmit={this.handleCommentSubmit}/>
          </div>
        </div>
      </div>
    );
  }
});


var CommentList = React.createClass({
  render: function() {
    var commentNodes = this.props.data.map(function (comment){
      return (
        <Comment author={comment.author}>
          {comment.text}
        </Comment>
      );
    });

    return (
      <div className="row">
        <div className="CommentList col-md-4">
          {commentNodes}
        </div>
      </div>
    );
  }
});

var CommentForm = React.createClass({
  handleCommentSubmit: function(e) {
    e.preventDefault();
    var author = React.findDOMNode(this.refs.author).value.trim();
    var text = React.findDOMNode(this.refs.text).value.trim();
    if (!text || !author) {
      return;
    }
    this.props.onCommentSubmit({author: author, text: text});
    React.findDOMNode(this.refs.author).value = '';
    React.findDOMNode(this.refs.text).value = '';
    return;
  },
  render: function() {
    return (
      <form className="commentForm" onSubmit={this.handleCommentSubmit}>
        <div className="form-group">
          <label> Name </label>
          <input type="text" className="form-control" placeholder="Your name" ref="author"/>
        </div>
        <div className="form-group">
          <textarea className="form-control" rows="4" placeholder="Say something..." ref="text"/>
        </div>
        <button type="submit" className="btn btn-default"> submit </button>
      </form>
    );
  }
});

var Comment = React.createClass({
  render: function() {
    var rawMarkup = marked(this.props.children.toString(), {sanitize: true});
    return ( 
      <div className="comment">
        <h2 className="commentAuthor">
          {this.props.author}
        </h2>
        <span dangerouslySetInnerHTML={{__html: rawMarkup}} />
      </div>
    );
  }
});


React.render(
  <CommentBox url="data.json" />,
  document.getElementById('content')
);
