// Service class that builds the markdown from given inputs (refs from lines 11–17)
export default class CStateBuildService {
    static build({ titleRaw, dateTime, messageDetails, incidentType, isPinned, affectedSystemsNodes }) {
        // Validate inputs and throw with human-friendly message; caller may alert it
        this._validate(titleRaw, dateTime, messageDetails, incidentType, affectedSystemsNodes);

        // Prepare strings
        const titleString = titleRaw;
        const messageString = messageDetails;

        // Build affected systems list markdown
        let affectedSystemsString = '\n';
        if (affectedSystemsNodes && affectedSystemsNodes.length > 0) {
            for (let i = 0; i < affectedSystemsNodes.length; i++) {
                affectedSystemsString += '- ' + affectedSystemsNodes[i] + '\n';
            }
        }

        // Compose final markdown
        return this._buildResult(
            titleString,
            dateTime,
            incidentType,
            isPinned === true,
            affectedSystemsString,
            messageString
        );
    }

    static _validate(titleRaw, dateTime, messageDetails, incidentType, affectedSystemsNodes) {
        if (!titleRaw || titleRaw.length <= 0) {
            throw new Error('Title is needed');
        }
        if (!dateTime || dateTime.length <= 0) {
            throw new Error('Date ist needed');
        }
        if (incidentType === null || incidentType === undefined) {
            throw new Error('Type is needed');
        }
        if (!affectedSystemsNodes || affectedSystemsNodes.length <= 0) {
            throw new Error('Service is needed');
        }
        if (!messageDetails || messageDetails.length <= 0) {
            throw new Error('Description is needed');
        }

        const messageLines = messageDetails.split('\n');
        for (let line of messageLines) {
            if (line.trim().startsWith('# ')) {
                throw new Error('Meldungstext/Beschreibung:\nBitte verwenden Sie nur Markdown-Überschriften ## (H2) oder tiefer.\nH1-Überschriften ("# ") sind reserviert und sollten nicht verwendet werden.');
            }
        }
    }

    static _buildResult(title, datetime, incidentType, isPinned, affectedSystemsString, messageDetails) {
        let result = '';

        result += '---\n'
        result += 'title: "' + title + '"\n';
        result += 'date: ' + datetime + ':00\n';
        switch (incidentType) {
            case "maintenance":
                result += '# resolved: true # field not needed for maintenance informational\n'
                result += '# resolvedWhen: ' + datetime + ':00 # field not needed for maintenance informational\n';
                result += '# severity: down # field not needed for maintenance informational\n'
                result += 'informational: true # field makes issue look more like a blog post and removes any references to downtime length\n'
                break;
            case "outage":
                result += 'resolved: false # Resolving: set to true\n'
                result += '# resolvedWhen: ' + datetime + ':00 # Resolving: remove comment, set correct end datetime\n';
                result += 'severity: down\n'
                result += '# informational: true # field makes issue look more like a blog post and removes any references to downtime length\n'
                break;
            case "interruption":
                result += 'resolved: false # Resolving: set to true\n'
                result += '# resolvedWhen: ' + datetime + ':00 # Resolving: remove comment, set correct end datetime\n';
                result += 'severity: disrupted\n'
                result += '# informational: true # field makes issue look more like a blog post and removes any references to downtime length\n'
                break;
            case "notice": // the related radio button is not active, included here for future activation
                result += 'resolved: false # Resolving: set to true\n'
                result += '# resolvedWhen: ' + datetime + ':00 # Resolving: remove comment, set correct end datetime\n';
                result += 'severity: notice\n'
                result += '# informational: true # field makes issue look more like a blog post and removes any references to downtime length\n'
                break;
        }
        result += `pin: ${isPinned === true ? "true # Resolving: set to false" : "false"}\n`
        result += 'affected:' + affectedSystemsString;
        result += 'section: issue\n';
        result += '---\n\n' + messageDetails + '\n';
        return result;
    }
}
