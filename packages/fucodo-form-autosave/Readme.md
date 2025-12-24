# form autosave

```html
<fucodo-form-autosave seconds="20" indicator="#autosaveProgress">
    <progress id="autosaveProgress" max="100" value="100"></progress>

    <form>
        <input name="title">
        <textarea name="notes"></textarea>
    </form>
</fucodo-form-autosave>
```

```html

<fucodo-form-autosave seconds="120" indicator="#autosaveProgress .progress-bar">
    <div id="autosaveProgress" max="100" value="100" class="progress" aria-label="Autospeichern Indicator" style="height: 3px; width: 100%" ><div class="progress-bar"></div></div>
    <f:form action="update" enctype="multipart/form-data" object="{object}" objectName="object" id="globalForm">
        <f:render partial="Domain/Model/Invoice/Fields" arguments="{_all}"/>
    </f:form>
</fucodo-form-autosave>

```