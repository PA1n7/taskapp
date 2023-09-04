# Taskapp

## There is still no official release of the app

## Recent updates
Fixed the General UI
There was an error getting first date of month which was fixed using the following line
> if (start < 0){start = 7+start}
The saved_data.json changed the way it saves the events from an array
> ["This is just a test", "Hello"]
to a dict that includes Title, color, and text
> {"3/9/2023":[{"Title":"Test", "color":"#000000", "text":"test"}]}

## TODO
*Create a sytem to add events to calendar*
```
Add color to events
Add text to events
```
*Create system to add things in todo*
~~Redesign~~
*Create text writer*
*Create the possibility to add custom themes*
*App Settings*
~~Read properly the new saved_data.json~~
