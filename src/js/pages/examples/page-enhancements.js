import { html } from "lit";
import { PureSPA } from "../../spa";
import { AutoComplete } from "../../autocomplete";
import { parseHTML } from "../../common";

export class PageEnhancements extends PureSPA.Page {
  static get properties() {
    return {
      readyToRenderTimeBasedDropDown: { type: Boolean },
    };
  }

  render() {
    return html`
      <div class="showcases">

        <h2>Enhanced inputs</h2>

        <div>

          <h3>Containing label with input (material style)</h3>


          <code>
            import { enhanceInputWithLabel } from "pure-web/common";
          </code>

          <input
            name="test"
            placeholder="Enter your full name..."
            type="text"
            data-label="Your name"
            maxlength="25"
          />
        </div>

        <div>

          <h3>Stars rating using a simple enhancement</h3>

          <code> &lt;input
          value="3"
          type="range"
          min="1"
          max="10"
          step="1"
          class="stars-rating"&gt; </code>

          <p>... and in your app:</p>
          <code>
            this.enhancers.add("input[type='range'].stars-rating", enhanceRangeStars);
          </code>

          <input
            value="3"
            type="range"
            min="1"
            max="10"
            step="1"
            class="stars-rating"
          />
        </div>

        <div>
          <h3>Dropdown Button</h3>

          <code>
            import { enhanceNavDropdownButton } from "pure-web/common";
          </code>

          <nav data-dropdown class="align-left">
            <button data-prepend-icon="menu"></button>
            <menu>
              <li><a href="/account">Account</a></li>
              <li><a href="/contact">Contact</a></li>
              <li>
                <a href="#" @click=${this.optionsClick}>Special options</a>
              </li>
              <li><hr /></li>
              <li><a href="/sign-out">Sign out</a></li>
            </menu>
          </nav>
        </div>

        <div>${this.renderTimeBasedDropDown()}</div>

        <div>
          <span id="dynamic-dom">
            This is going to be replaced via DOM manipulation...
          </span>
        </div>

        <div>
          <h3>AutoComplete</h3>

          <code> import { AutoComplete } from "pure-web/ac"; </code>

          <p>... and a small connecting piece of JS</p>

          <code>
            &lt;input
              data-prefix="a"
              &commat;focus=&dollar;{(e) => {
                AutoComplete.connect(e, this.autoCompleteOptions);
              }}
              type="search"
              placeholder="Search everything..."
            /&gt;
            </code>

          <label
            ><span data-label>Omnibox</span
            ><input
              data-prefix="a"
              @focus=${(e) => {
                AutoComplete.connect(e, this.autoCompleteOptions);
              }}
              type="search"
              placeholder="Search everything..."
          /></label>
        </div>


      </div>
    `;
  }

  firstUpdated() {
    setTimeout(() => {
      this.readyToRenderTimeBasedDropDown = true;
    }, 2000);

    setTimeout(() => {
      const elm = this.querySelector("#dynamic-dom");

      const input = parseHTML(/*html*/ `
        <div>
          <p>Running enhancements on dynamically inserted DOM elements</p>
          <input data-label="Test label" type="email" placeholder="Enter email address" />
        </div>`)[0];

      elm.innerHTML = "";
      elm.appendChild(input);
    }, 3000);
  }

  renderTimeBasedDropDown() {
    if (!this.readyToRenderTimeBasedDropDown)
      return html`This is going to be rendered via Lit when
        <em>readyToRenderTimeBasedDropDown</em> changes...`;

    return html`<div>
      <h3>Dropdown Button (rendered after 2 seconds)</h3>

      <nav data-dropdown class="align-right" style="float: right">
        <button>Dropdown menu</button>
        <menu>
          <li><a href="/account">Account</a></li>
          <li><a href="/contact">Contact</a></li>
          <li><a href="#" @click=${this.optionsClick}>Special options</a></li>
          <li><hr /></li>
          <li><a href="/sign-out">Sign out</a></li>
        </menu>
      </nav>
    </div>`;
  }

  // autoCompleteController(ac) {
  //   return {
  //     show: () => {
        
  //        if (isMobileView()) {
          
  //          //ac.container.classList.toggle("is-mobile")
  //        }
  //        else ac.show();
  //     },
  //     hide: () => {
  //       if (isMobileView()) {
  //         //ac.resultsDiv.style.display = "none";
  //       }
  //       else ac.hide();
  //     },
  //     empty: () => {
  //       ac.empty();
  //     },
  //     clear(){
  //       ac.clear();
  //     }
  //   };
  // }

  get autoCompleteOptions() {
    return {
      //debug: true,
      //controller: this.autoCompleteController,
      hideCategry: true,
      // debug: true,
      categories: {
        Site: {
          trigger: (options) => {
            return options.search.length === 0;
          },
          action: (options) => {
            location.href = options.path;
          },
          getItems: () => {
            return app.config.pages
              .filter((p) => !p.hidden)
              .map((p) => {
                return {
                  text: p.name,
                  path: p.path,
                  icon: "right",
                };
              });
          },
        },
        Search: {
          trigger: (options) => {
            return options.search.length > 0;
          },

          getItems: (options) => {
            const fltr = AutoComplete.textFilter(options);
            return ["Pete", "Jane", "John", "Maria", "Robert", "Zack"]
              .filter(fltr)
              .map((i) => {
                return { text: i, description: "User name", icon: "user" };
              });
          },
        },
      },
    };
  }
}
