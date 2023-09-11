# Taskapp

## There is still no official release of the app

## Recent updates

The most recent update, I did basically everything in the TODO (check down below for more details), I just need to finish moving the save files somewhere else so that in case there is an update the save files aren't lost completely.

The folder called Techno has a video called background.mp4 which was excluded from push due to it's size

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

### *Change directory of save files for update proof*

## Completed TODO

~~Create a sytem to add events to calendar~~

~~Add color to events~~

~~Add text to events~~

~~Create system to add things in todo~~

~~Redesign~~

~~Read properly the new saved_data.json~~

~~Create the possibility to edit or delete todo events~~

~~Create text writer~~

~~Merge TODO and calendar~~

~~Create the possibility to add custom themes~~

~~App settings~~

~~App UI~~