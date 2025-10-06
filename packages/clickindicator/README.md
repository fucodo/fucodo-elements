## fucodo-clickindicator

```html
<loading-action
  active-class="is-loading"
  duration="2500"
  event="action-finished"
>
  <button class="btn btn-primary">Speichern</button>
</loading-action>
```

| attribute    | description                                     |
|--------------|-------------------------------------------------|
| active-class | class, the button gets, once clicked            |
| duration     | wait duration after the click event             |
| event        | event fired after the button returns it's state |


## Examples

### using the loadingIndicator classes:

The namespaced tags are fluid viewHelpers, are are not that important for this example.

```html
<fucodo-loading-action duration="1000">
    <button type="submit" form="globalForm" class="btn btn-success btn-sm" accesskey="s">
        <span class="loadingIndicator">
            <fucodo-spinner size="12"></fucodo-spinner>
        </span>
        <span class="notLoadingIndicator">
            <i:icon name="{button.icon}" size="14"></i:icon>
        </span>
        {btnLabel}
    </button>
</fucodo-loading-action>
```

### event

```javascript
document.querySelector('fucodo-loading-action')?.addEventListener('action-finished', (e) => {
    console.log('Fertig:', e.detail.trigger);
});
```