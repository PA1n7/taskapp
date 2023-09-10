# Taskapp

## There is still no official release of the app

## Recent updates
Added the option to add Events to the calendar

Fixed the TODO writing system so that is now done.

Fixed the General UI

There was an error getting first date of month which was fixed using the following line

> if (start < 0){start = 7+start}

The saved_data.json changed the way it saves the events from an array

```
[
    "This is just a test",
    "Hello"
]
```

to a dict that includes Title, color, and text

```
{
    "2/9/2023":[{
        "Title":"Test for add btn",
        "color":"#FFFFFF",
        "text":"probably doesn't go to bottom, imma leave it like that tho"
    }]
}
```

## TODO

### *Create the possibility to edit or delete todo events*

### *Create text writer*

### *Create the possibility to add custom themes*

### *App Settings*

### *Final UI*

### *Budgeting* (optional)

## Completed TODO

~~Create a sytem to add events to calendar~~

~~Add color to events~~

~~Add text to events~~

~~Create system to add things in todo~~

~~Redesign~~

~~Read properly the new saved_data.json~~