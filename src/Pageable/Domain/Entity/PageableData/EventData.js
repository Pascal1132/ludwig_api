const APageableData = require("../../Backbone/APageableData");
const Functions = require("../../../../Functions");

module.exports = class EventData extends APageableData {
    id;
    previewIcon;
    previewText;
    previewImage;
    title;
    schedule = {
        start: undefined,
        end: undefined,
    };
    static getReferenceForRequest() {
        return {
            name: 'event',
            prefix: 'event_page_',
            table: 'events_page',
            hasParentId: false
        }
    }

    static leftJoins() {
        return [
            {
                table: "event_schedule_dates",
                on: "events_page.event_page_id = event_schedule_dates.event_schedule_date_event_id",
            },
            {
                table: "events_page_data",
                on: "events_page.event_page_id = events_page_data.event_page_data_reference_id AND events_page_data.event_page_data_created_at = events_page.event_page_version",
            },
        ];
    }

    static select() {
        return [
            "CAST(events_page.event_page_id as CHAR) as event_page_id",
            "event_page_data_preview_icon",
            "event_page_data_preview_text",
            "event_page_data_preview_image",
            "event_page_data_title",
            "event_schedule_date_start",
            "event_schedule_date_end",
        ];
    }

    static createFromMysql(rows) {
        return rows.map(row => {
            const event = new EventData(row);
            event.id = row.event_page_id;
            event.previewIcon = Functions.languageDecode(row.event_page_data_preview_icon);
            event.previewText = Functions.languageDecode(row.event_page_data_preview_text);
            event.previewImage = Functions.languageDecode(row.event_page_data_preview_image);
            event.title = Functions.languageDecode(row.event_page_data_title);
            event.schedule.start = row.event_schedule_date_start;
            event.schedule.end = row.event_schedule_date_end;
            return event;
        });
    }

    static requestFilters(params = {}, requestConditions = []) {
        if (params.timestamp) {
            requestConditions.push(`(${params.timestamp} BETWEEN event_schedule_dates.event_schedule_date_start AND event_schedule_dates.event_schedule_date_end)`);
        }
        return requestConditions;
    }

    toJSON(language) {
        const data = super.toJSON(language);
        data.previewIcon = this.previewIcon?.[language] ?? '';
        data.previewText = this.previewText?.[language] ?? '';
        data.previewImage = this.previewImage?.[language] ?? '';
        data.title = this.title?.[language] ?? '';
        data.schedule = this.schedule;
        return data;
    }
}