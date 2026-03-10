class AjaxChoices extends HTMLElement {
    watchForMutations(select) {
        this.mutationObserver = new MutationObserver(
            (mutationList, observer) => {
                this.mutationObserver.disconnect();
                this.choices.refresh(true);
                if (select.hasAttribute('disabled')) {
                    this.choices.disable();
                } else {
                    this.choices.enable();
                }
                this.watchForMutations(select);
            }
        );
        this.mutationObserver.observe(select, {attributes: true, childList: true, subtree: true});
    }

    connectedCallback() {
        // Find the inner select element
        const select = this.querySelector('select');
        if (!select) return;

        // Read data attributes
        const url = select.getAttribute('data-ajax--url');
        const cacheEnabled = select.getAttribute('data-ajax--cache') === 'true';

        // Cache object keyed by search term
        const cache = {};

        // Initialize Choices with basic config
        this.choices = new Choices(
            select,
            {
                removeItemButton: true,
                searchResultLimit: 10,
                classNames: {
                    containerInner: 'form-control'
                }
            }
        );

        // choices__list choices__list--single

        this.watchForMutations(select);

        // Listen for Choices search event and load remote data
        select.addEventListener('search', async (evt) => {
            const term = evt.detail.value;
            if (!term || !url) return;

            // Use cached result if available
            if (cacheEnabled && cache[term]) {
                choices.setChoices([], 'value', 'label', true);
                choices.setChoices(cache[term], 'value', 'label', false);
                return;
            }

            try {
                // Fetch remote results (Select2 uses “term” by default)
                const query = encodeURIComponent(term);
                const response = await fetch(`${url}&q=${encodeURIComponent(query)}`);
                const data = await response.json();

                // Transform server response into Choices format
                // Select2 AJAX responses contain an array of objects with id/text:contentReference[oaicite:2]{index=2}.
                const newChoices = (data.results || data).map(item => ({
                    value: item.id,
                    label: item.text
                }));

                // Cache the result
                if (cacheEnabled) cache[term] = newChoices;

                this.choices.setChoices([], 'value', 'label', true);
                // Replace current choices, preserving selected items
                this.choices.setChoices(newChoices, 'value', 'label', false);
                this.choices.enable();
            } catch (err) {
                console.error(err);
            }
        });
    }
}



// Define the custom element
customElements.define('fucodo-select', AjaxChoices);
