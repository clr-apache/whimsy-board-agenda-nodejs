import Agenda from "../models/agenda.js";
import Link from "../elements/link.js";
import MarkSeen from "../buttons/markseen.js";
import Pending from "../models/pending.js";
import React from "react";
import ShowSeen from "../buttons/showseen.js";

//
// A page showing all comments present across all agenda items
// Conditionally hide comments previously marked as seen.
//
class Comments extends React.Component {
  static buttons() {
    let buttons = [];

    if (MarkSeen.undo || Agenda.index.any(item => !item.unseen_comments.empty)) {
      buttons.push({ button: MarkSeen })
    };

    if (Pending.seen && !Pending.seen.keys().empty) {
      buttons.push({ button: ShowSeen })
    };

    return buttons
  };

  state = { showseen: false };

  toggleseen() {
    this.setState({ showseen: !this.state.showseen })
  };

  render() {
    let found = false;

    return <>
      {Agenda.index.map((item) => {
        if (item.comments.length === 0) return null;
        let visible = this.state.showseen ? item.comments : item.unseen_comments;

        if (visible.length !== 0) {
          found = true;

          return <section>
            <Link text={item.title} href={item.href} className={`h4 ${item.color}`} />
            {visible.map(comment => <pre className="comment">{comment}</pre>)}
          </section>
        } else {
          return null
        }
      })}

      {!found ? <p>{Object.keys(Pending.seen).length === 0 ? <em>No comments found</em> : <em>No new comments found</em>}</p> : null}
    </>
  }
};

export default Comments