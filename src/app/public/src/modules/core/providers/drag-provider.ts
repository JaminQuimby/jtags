import { JTagInputComponent } from './../../components/j-tag-input/j-tag-input.component';
import { JTagModel } from '../accessor';

import { Injectable } from '@angular/core';

export declare interface DraggedTag {
    index: number;
    tag: JTagModel;
    zone: string;
}

import { DRAG_AND_DROP_KEY } from '../../core/constants';

export declare interface State {
    dragging: boolean;
    dropping: boolean;
    index: number | undefined;
}

export declare type StateProperty = keyof State;

@Injectable()
export class DragProvider {
    public sender: JTagInputComponent;
    public receiver: JTagInputComponent;

    public state: State = {
        dragging: false,
        dropping: false,
        index: undefined
    };

    public setDraggedItem(event: DragEvent, tag: DraggedTag): void {
        event.dataTransfer.setData(DRAG_AND_DROP_KEY, JSON.stringify(tag));
    }

    public getDraggedItem(event: DragEvent): DraggedTag {
        const data = event.dataTransfer.getData(DRAG_AND_DROP_KEY);

        return JSON.parse(data) as DraggedTag;
    }

    public setSender(sender: JTagInputComponent): void {
        this.sender = sender;
    }

    public setReceiver(receiver: JTagInputComponent): void {
        this.receiver = receiver;
    }

    public onTagDropped(tag: JTagModel, indexDragged: number, indexDropped: number): void {
        this.onDragEnd();

        this.sender.onRemoveRequested(tag, indexDragged);
        this.receiver.onAddingRequested(false, tag, indexDropped);
    }

    public setState(state: {[K in StateProperty]?: State[K]}): void {
        this.state = {...this.state, ...state};
    }

    public getState(key?: StateProperty): State | State[StateProperty] {
        return key ? this.state[key] : this.state;
    }

    public onDragEnd(): void {
        this.setState({
            dragging: false,
            dropping: false,
            index: undefined
        });
    }
}
