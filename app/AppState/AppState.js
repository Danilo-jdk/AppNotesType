import React, {useState, useEffect} from "react";
import AppNavigation from "../AppNavigation/AppNavigation";

export default function AppState() {
    const [allNotes, setAllNotes] = useState([
        {noteId: 1, noteTitle: 'prima nota', noteText: 'ciao'},
        {noteId: 2, noteTitle: 'seconda nota', noteText: 'buongiorno a tutti quanti'},
        {noteId: 3, noteTitle: 'terza nota', noteText: 'buonasera'}
    ]);

    const [note, setNote] = useState([]);

    const StatiGlobali = {
        allNotes,
        setAllNotes,
        note,
        setNote
    };

    return <AppNavigation StatiGlobali={StatiGlobali} />
}