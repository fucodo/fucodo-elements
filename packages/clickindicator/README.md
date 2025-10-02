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


## Example

```javascript
document.querySelector('fucodo-loading-action')?.addEventListener('action-finished', (e) => {
    console.log('Fertig:', e.detail.trigger);
});
```