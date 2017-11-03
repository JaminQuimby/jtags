import { JTaginputInterface } from './j-tag.interface';
import { JTagService } from './j-tag.service';
export declare class JTagComponent {
    service: JTagService;
    selectedTags: JTaginputInterface;
    constructor(service: JTagService);
}
