// Cria uma expressão funcional imediatamente invocada para encapsular o código
(function () {
  // Define o construtor
  this.Modal = function () {
    // Referencia global
    this.closeButton = null;
    this.modal = null;
    this.overlay = null;

    this.transitionEnd = transitionSelect();

    // Opção padrão para modal
    var defaults = {
      autoOpen: false,
      className: "fade-and-drop",
      closeButton: true,
      content: "",
      maxWidth: 600,
      minWidth: 280,
      overlay: true,
    };

    // Create options by extending defaults with the passed in arugments
    if (arguments[0] && typeof arguments[0] === "object") {
      this.options = extendDefaults(defaults, arguments[0]);
    }

    if (this.options.autoOpen === true) this.open();
  };

  // Public Methods

  Modal.prototype.close = function () {
    var _ = this;
    this.modal.className = this.modal.className.replace(" scotch-open", "");
    this.overlay.className = this.overlay.className.replace(" scotch-open", "");
    this.modal.addEventListener(this.transitionEnd, function () {
      _.modal.parentNode.removeChild(_.modal);
    });
    this.overlay.addEventListener(this.transitionEnd, function () {
      if (_.overlay.parentNode) _.overlay.parentNode.removeChild(_.overlay);
    });
  };

  Modal.prototype.open = function () {
    buildOut.call(this);
    initializeEvents.call(this);
    window.getComputedStyle(this.modal).height;
    this.modal.className =
      this.modal.className +
      (this.modal.offsetHeight > window.innerHeight
        ? " scotch-open scotch-anchored"
        : " scotch-open");
    this.overlay.className = this.overlay.className + " scotch-open";
  };

  function buildOut() {
    var content, contentHolder, docFrag;

    /*
     * If content is an HTML string, append the HTML string.
     * If content is a domNode, append its content.
     */

    if (typeof this.options.content === "string") {
      content = this.options.content;
    } else {
      content = this.options.content.innerHTML;
    }

    // Create a DocumentFragment to build with
    docFrag = document.createDocumentFragment();

    // Create modal element
    this.modal = document.createElement("div");
    this.modal.className = "scotch-modal " + this.options.className;
    this.modal.style.minWidth = this.options.minWidth + "px";
    this.modal.style.maxWidth = this.options.maxWidth + "px";

    // If overlay is true, add one
    if (this.options.overlay === true) {
      this.overlay = document.createElement("div");
      this.overlay.className = "scotch-overlay " + this.options.className;
      docFrag.appendChild(this.overlay);
    }

    // Create content area and append to modal
    contentHolder = document.createElement("div");
    contentHolder.className = "scotch-content";
    contentHolder.innerHTML = content;
    this.modal.appendChild(contentHolder);

    // Append modal to DocumentFragment
    docFrag.appendChild(this.modal);

    // Append DocumentFragment to body
    document.body.appendChild(docFrag);
  }

  function extendDefaults(source, properties) {
    var property;
    for (property in properties) {
      if (properties.hasOwnProperty(property)) {
        source[property] = properties[property];
      }
    }
    return source;
  }

  function initializeEvents() {
    if (this.closeButton) {
      this.closeButton.addEventListener("click", this.close.bind(this));
    }

    if (this.overlay) {
      this.overlay.addEventListener("click", this.close.bind(this));
    }
  }

  function transitionSelect() {
    var el = document.createElement("div");
    if (el.style.WebkitTransition) return "webkitTransitionEnd";
    if (el.style.OTransition) return "oTransitionEnd";
    return "transitionend";
  }
})();

var myContent = document.getElementById("content");

var myModal = new Modal({
  content: myContent,
});

var triggerButton = document.querySelector(".price-button");
triggerButton.addEventListener("click", function () {
  document.querySelector(".detail").style.opacity = "1";
  var carrinho = Number(document.querySelector(".detail").innerHTML);
  Number((document.querySelector(".detail").innerHTML = carrinho + 1));
  console.log(carrinho);
  myModal.open();
});

function modalclose() {
  myModal.close();
}
