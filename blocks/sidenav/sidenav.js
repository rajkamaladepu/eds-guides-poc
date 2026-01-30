import { migrateTree } from "../utils.js";
const treeData = [{"displayName":"About indexing tasks and subtasks","url":"contents/managing-indexes/about-the-indexing-wizards/about-indexing-tasks-and-subtasks"},{"displayName":"Configuring the deletion of indexing subtasks","url":"contents/managing-indexes/about-the-indexing-wizards/configuring-the-deletion-of-indexing-subtasks"},{"displayName":"About the Upgrade wizard","url":"","children":[{"displayName":"About the Upgrade wizard","url":"contents/managing-indexes/about-the-indexing-wizards/about-the-upgrade-wizard"},{"displayName":"Deletion of upgraded index volumes","url":"contents/managing-indexes/about-the-indexing-wizards/about-the-upgrade-wizard/deletion-of-upgraded-index-volumes"}]},{"displayName":"About the Verify wizard","url":"contents/managing-indexes/about-the-indexing-wizards/about-the-verify-wizard"},{"displayName":"About the Synchronize wizard","url":"contents/managing-indexes/about-the-indexing-wizards/about-the-synchronize-wizard"},{"displayName":"About the Rebuild wizard","url":"","children":[{"displayName":"About the Rebuild wizard","url":"contents/managing-indexes/about-the-indexing-wizards/about-the-rebuild-wizard"},{"displayName":"Deletion of rebuilt index volumes","url":"contents/managing-indexes/about-the-indexing-wizards/about-the-rebuild-wizard/deletion-of-rebuilt-index-volumes"}]},{"displayName":"About the Change Location wizard","url":"contents/managing-indexes/about-the-indexing-wizards/about-the-change-location-wizard"},{"displayName":"Using the indexing wizards","url":"contents/managing-indexes/about-the-indexing-wizards/using-the-indexing-wizards"},{"displayName":"Managing indexing tasks","url":"","children":[{"displayName":"Managing indexing tasks","url":"contents/managing-indexes/about-the-indexing-wizards/managing-indexing-tasks"},{"displayName":"Using the Monitor Indexing Tasks page","url":"contents/managing-indexes/about-the-indexing-wizards/managing-indexing-tasks/using-the-monitor-indexing-tasks-page"},{"displayName":"Using the Monitor Indexing Tasks page (subtask view)","url":"contents/managing-indexes/about-the-indexing-wizards/managing-indexing-tasks/using-the-monitor-indexing-tasks-page-subtask-view"},{"displayName":"Subtask statuses","url":"contents/managing-indexes/about-the-indexing-wizards/managing-indexing-tasks/subtask-statuses"},{"displayName":"Managing index upgrade and index rebuild tasks","url":"contents/managing-indexes/about-the-indexing-wizards/managing-indexing-tasks/managing-index-upgrade-and-index-rebuild-tasks"},{"displayName":"Managing index verification tasks","url":"contents/managing-indexes/about-the-indexing-wizards/managing-indexing-tasks/managing-index-verification-tasks"},{"displayName":"Managing index synchronization tasks","url":"contents/managing-indexes/about-the-indexing-wizards/managing-indexing-tasks/managing-index-synchronization-tasks"},{"displayName":"Managing change location tasks","url":"contents/managing-indexes/about-the-indexing-wizards/managing-indexing-tasks/managing-change-location-tasks"}]}]
const mapTitle = "About the indexing wizards"
const isDesktop = window.matchMedia("(min-width: 900px)");

function expandHeirarchy(element, root) {
  if (element === root) return;
  let parent = element.parentElement;
  parent.classList.remove("closed");
  expandHeirarchy(parent, root);
}

function expandSelection(parent) {
  let queryString = window.location.search;
  let params = new URLSearchParams(queryString);
  let id = params.get("expand");
  let element = document.getElementById(`sidenav-li-${id}`);
  if (!element) return;
  element.classList.add("selected");
  expandHeirarchy(element, parent);
  element.scrollIntoView();
}

function scrollSidenavSelectionToView() {
  const element = document.querySelector('.sidenav-list-item.selected')
  const sidenavContainer = document.getElementsByClassName("sidenav-container")[0];
  if(!element) return
  if (element.offsetTop < sidenavContainer.scrollTop || element.offsetTop + element.offsetHeight > sidenavContainer.scrollTop + sidenavContainer.clientHeight) {
    sidenavContainer.scrollTo({
      top: Math.max(element.offsetTop - 110, 0),
      behavior: 'smooth'
    });
  }
}



function addResizeBar() {
  const sidenavContainer = document.getElementsByClassName("sidenav-container")[0];
  const div = document.createElement("div");
  div.classList.add('sidenav-resize-bar');
  let isResizing = false
  div.addEventListener('mousedown', (evt) => {
    isResizing = true
    document.addEventListener('mousemove', function (event) {
      if (isResizing) {
        let newWidth = event.pageX - sidenavContainer.offsetLeft;
        sidenavContainer.style.width = `${newWidth}px`;
      }
    })
  })
  document.addEventListener('mouseup', function () {
    if (isResizing) {
      isResizing = false;
    }
  })
  sidenavContainer.insertAdjacentElement("afterend", div)
}

function addExpandCollapseButton() {
  const divWrapper = document.createElement("div");
  divWrapper.classList.add('title-close-wrapper')
  const titleSpan = document.createElement("span");
  titleSpan.classList.add('title-span')
  titleSpan.textContent = mapTitle
  const span = document.createElement("span");
  span.classList.add('sidenav-expand-collapse')
  span.classList.add('open')
  const sidenavContainer = document.getElementsByClassName("sidenav-container")[0];
  span.addEventListener('click', () => {
    const isOpen = span.classList.contains('open')
    const sidenavResizer = document.getElementsByClassName("sidenav-resize-bar")[0];
    if(!isOpen) {
      sidenavContainer.classList.remove('collapse-width')
      sidenavResizer.classList.remove('force-hide')
    } else {
      sidenavContainer.classList.add('collapse-width')
      sidenavResizer.classList.add('force-hide')
    }
    span.classList.toggle("open");
  })
  divWrapper.append(titleSpan)
  divWrapper.append(span)
  sidenavContainer.prepend(divWrapper)
}

function generateId(prefix, suffix) {
  if(prefix) {
      return `${prefix}-${suffix}`
  }
  return `${suffix}`
}


window.addEventListener('aem-app-ready', () => {
  scrollSidenavSelectionToView()
})


function createTree(parent, data, prefix, level) {
  const ul = document.createElement("ul");
  ul.classList.add("tree");
  parent.appendChild(ul);
  data.forEach((item, idx) => {
    const li = document.createElement("li");
    const newPrefix = generateId(prefix, level)
    const _id = generateId(newPrefix, idx);
    li.setAttribute("id", `sidenav-li-${_id}`);
    ul.appendChild(li);
    const anchor = document.createElement("a");
    const span = document.createElement("span");
    span.classList.add("chevron-icon-span");
    anchor.textContent = item.displayName;
    anchor.setAttribute("data-li-id", _id);
    anchor.setAttribute("title", item.displayName);
    anchor.setAttribute("aria-label", item.displayName);
    const siteURL =
      window.location.protocol +
      "//" +
      window.location.hostname +
      (window.location.port ? ":" + window.location.port : "");
    if (item.url) {
      let navURL = new URL(item.url, siteURL).href;
      anchor.setAttribute("href", navURL);
      anchor.addEventListener("click", (event) => {
        event.preventDefault();
        onClick(anchor.getAttribute("data-li-id"), navURL);
      });
    }
    li.classList.add("sidenav-list-item");
    li.classList.add("closed");
    if (item.children) {
      li.classList.add("has-children");
      const wrapperSpan = document.createElement("span");
      wrapperSpan.classList.add("chevron-text-wrapper");
      wrapperSpan.appendChild(span);
      wrapperSpan.appendChild(anchor);
      li.appendChild(wrapperSpan);
      createTree(li, item.children, newPrefix, idx);
    } else {
      li.appendChild(anchor);
    }
  });
}

function onClick(id, navURL) {
  const url = new URL(navURL);
  url.searchParams.set("expand", id); // set the query parameter
  window.location.href = url.toString(); // navigate
}

// Get the treeview element and create the tree
const treeview = document.getElementsByClassName("sidenav")[0];
addExpandCollapseButton();
createTree(treeview, treeData, '', '');
migrateTree(isDesktop);
addResizeBar(treeview);
isDesktop.addEventListener("change", () => migrateTree(isDesktop));
expandSelection(treeview);

// Add click event listener to each span element
treeview.querySelectorAll("span").forEach((span) => {
  span.addEventListener("click", (event) => {
    // Toggle the "closed" class on the parent li element
    event.currentTarget.parentNode.classList.toggle("closed");
  });
});