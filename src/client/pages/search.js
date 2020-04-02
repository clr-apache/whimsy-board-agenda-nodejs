import Agenda from "../models/agenda.js";
import Link from "../elements/link.js";
import React from "react";
import { htmlEscape } from "../utils.js";

//
// Search component: 
//  * prompt for search 
//  * display matching paragraphs from agenda, highlighting search strings
//  * keep query string in window location URL in synch
//
class Search extends React.Component {
  // initialize query text based on data passed to the component
  state = {text: this.props.item.query || ""};

  render() {
    let matches = false;
    let text;

    return <>
      <div className="search">
        <label htmlFor="search_text">Search:</label>
        <input id="search-text" autofocus="autofocus" value={this.state.text} onInput={this.input}/>
      </div>

      {this.state.text.length > 2 ? <>
        {text = this.state.text.toLowerCase()}

        {Agenda.index.map((item) => {
          if (!item.text || !item.text.toLowerCase().includes(text)) return null;
          matches = true;

          return <section>
            <h4>
              <Link text={item.title} href={item.href}/>
            </h4>

            {item.text.split(/\n\s*\n/).map((paragraph) => {
              if (paragraph.toLowerCase().includes(text)) {
                return <pre className="report" domPropsInnerHTML={htmlEscape(paragraph).replace(
                  new RegExp(`(${text})`, "gi"),
                  "<span class='hilite'>$1</span>"
                )}/>
              } else {
                return null
              }
            })}
          </section>
        })}

        {!matches ? <p>
          <em>No matches</em>
        </p> : null}
      </> : <p>Please enter at least three characters</p>}
    </>
  };

  // update text whenever input changes
  input(event) {
    this.setState({text: event.target.value})
  };

  // set history on initial rendering
  mounted() {
    this.updateHistory()
  };

  // replace history state on subsequent renderings
  updated() {
    this.updateHistory()
  };

  updateHistory() {
    let state = {path: "search", query: this.state.text};

    if (state.query) {
      window.history.replaceState(
        state,
        null,
        `search?q=${encodeURIComponent(this.state.text)}`
      )
    } else {
      window.history.replaceState(state, null, "search")
    }
  }
};

export default Search