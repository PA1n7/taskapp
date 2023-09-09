# Taskapp

## There is still no official release of the app

## Recent updates
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
### *Create a sytem to add events to calendar*

> Add color to events

> Add text to events

### *Create system to add things in todo*

~~Redesign~~

### *Create text writer*

### *Create the possibility to add custom themes*

### *App Settings*

~~Read properly the new saved_data.json~~

## I'm still missing everything that has to do with the budgeting segment of the app
