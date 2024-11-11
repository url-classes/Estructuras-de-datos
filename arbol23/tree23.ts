import Data from "./data";
import TreeNode from "./treenode";
import Alumno from "./alumno";

export default class Tree23 {
    public root: TreeNode;

    constructor(alumno: Alumno) {
        const data = new Data(alumno); 
        this.root = new TreeNode(data);
    }

    public insert(alumno: Alumno, ref: TreeNode = this.root): [TreeNode, Data, TreeNode] | null {
        const data = new Data(alumno);

        if (ref.isLeaf()) {
            if (ref.isFull() && ref.data2) {
                return this.switchNode(ref, data);
            } else {
                ref.insert(data);
                return null;
            }
        } else {
            const branch = ref.getBranch(data.key);
            const result = this.insert(alumno, branch);

            if (result) {
                const [leftChild, promotedKey, middleChild] = result;

                if (ref.isFull()) {
                    return this.switchNode(ref, promotedKey, leftChild, middleChild);
                } else {
                    ref.insert(promotedKey);
                    if (promotedKey.key < ref.data1.key) {
                        ref.left = leftChild;
                        ref.middle = middleChild;
                    } else {
                        ref.middle = leftChild;
                        ref.right = middleChild;
                    }
                    return null;
                }
            }
        }
        return null;
    }

    private switchNode(
        node: TreeNode,
        newData: Data,
        leftChild: TreeNode | undefined = undefined,
        middleChild: TreeNode | undefined = undefined
    ): [TreeNode, Data, TreeNode] | null {
        let leftKey: TreeNode;
        let promotedKey: Data;
        let middleKey: TreeNode;

        if (newData.key < node.data1.key) {
            leftKey = new TreeNode(newData);
            promotedKey = node.data1;
            middleKey = new TreeNode(node.data2!);
        } else if (newData.key > node.data1.key && newData.key < node.data2!.key) {
            leftKey = new TreeNode(node.data1);
            promotedKey = newData;
            middleKey = new TreeNode(node.data2!);
        } else {
            leftKey = new TreeNode(node.data1);
            promotedKey = node.data2!;
            middleKey = new TreeNode(newData);
        }
        if (node.left && node.middle) {
            if (newData.key < node.data1.key) {
                leftKey.left = leftChild || node.left;
                leftKey.middle = middleChild || node.middle;
                middleKey.left = node.middle;
                middleKey.middle = node.right;
            } else if (newData.key > node.data1.key && newData.key < node.data2!.key) {
                leftKey.left = node.left;
                leftKey.middle = leftChild;
                middleKey.left = middleChild;
                middleKey.middle = node.right;
            } else {
                leftKey.left = node.left;
                leftKey.middle = node.middle;
                middleKey.left = leftChild;
                middleKey.middle = middleChild;
            }
        }

        if (node === this.root) {
            const newRoot = new TreeNode(promotedKey);
            newRoot.left = leftKey;
            newRoot.middle = middleKey;
            this.root = newRoot;
            return null;
        } else {
            return [leftKey, promotedKey, middleKey];
        }
    }

    public search(nota: number, ref: TreeNode = this.root): TreeNode | null {
        if (nota === ref.data1.key) {
            return ref;
        } else if (ref.data2 && nota === ref.data2.key) {
            return ref;
        } else if (ref.isLeaf()) {
            return null;
        } else {
            const branch = ref.getBranch(nota);
            return branch ? this.search(nota, branch) : null;
        }
    }

    public searchData(key: number, ref: TreeNode = this.root, parent: TreeNode | null = null): string | null | TreeNode {
        if (key === ref.data1.key || (ref.data2 && key === ref.data2.key)) {
            let result = `Promedio no encontrado:\n`;
            result += `- data1: { key: ${ref.data1.key}, payload: ${JSON.stringify(ref.data1.payload)} }\n`;
            if (ref.data2) {
                result += `- data2: { key: ${ref.data2.key}, payload: ${JSON.stringify(ref.data2.payload)} }\n`;
            } else {
                result += `- data2: undefined\n`;
            }
    
            if (parent) {
                result += `- Padre: { key: ${parent.data1.key}`;
                if (parent.data2) {
                    result += `, data2: { key: ${parent.data2.key} }`;
                }
                result += ` }\n`;
            } else {
                result += `- Padre: null (es la raíz)\n`;
            }
    
            result += `- Hijos:\n`;
            result += `  - left: ${ref.left ? `data1: { key: ${ref.left.data1.key} }` : 'null'}\n`;
            result += `  - middle: ${ref.middle ? `data1: { key: ${ref.middle.data1.key} }` : 'null'}\n`;
            result += `  - right: ${ref.right ? `data1: { key: ${ref.right.data1.key} }` : 'null'}\n`;
    
            return result;
        } else if (ref.isLeaf()) {
            return null;
        } else {
            const branch = ref.getBranch(key);
            return branch ? this.searchData(key, branch, ref) : null;
        }
    }


    public searchInRange(minNota: number, maxNota: number, ref: TreeNode = this.root, results: Alumno[] = []): Alumno[] {
    if (!ref) 
        return results;
    if (ref.data1.key >= minNota && ref.data1.key <= maxNota) {
        results.push(ref.data1.payload);
    }
    if (ref.data2 && ref.data2.key >= minNota && ref.data2.key <= maxNota) {
        results.push(ref.data2.payload);
    }
    if (ref.left && minNota < ref.data1.key) {
        this.searchInRange(minNota, maxNota, ref.left, results);
    }
    if (ref.middle && (ref.data2 === undefined || maxNota <= ref.data2.key)) {
        this.searchInRange(minNota, maxNota, ref.middle, results);
    }
    if (ref.right && ref.data2 && maxNota > ref.data2.key) {
        this.searchInRange(minNota, maxNota, ref.right, results);
    }

    return results;
}
    

    public delete(nota: number, ref: TreeNode | undefined = this.root) {
        const nodeDelete = this.search(nota, ref);
        if (!nodeDelete) {
            return nodeDelete; 
        }

        if (!nodeDelete.data2) {
            this.mergeDelete(nodeDelete);
        }

        if (nodeDelete.isLeaf() && nodeDelete.data2) {
            this.simpleDelete(nodeDelete, nota);
        }
    }

    public simpleDelete(node: TreeNode, key: number) {
        if (key === node.data1.key) {
            node.data1 = node.data2!;
            node.data2 = undefined;
        }

        if (node.data2 && key === node.data2.key) {
            node.data2 = undefined;
        }

        if (node === this.root && !node.data2 && !node.left) {
            this.root = node.left || node.middle!;
        }
    }

    public mergeDelete(node: TreeNode) {
        const parent = this.findParent(this.root, node);
        if (!parent) return;

        if (parent.left === node && parent.middle) {
            parent.left.data1 = parent.data1;
            parent.data1 = parent.middle.data1;

            if (parent.data2 && parent.right) {
                if (parent.middle.data2) {
                    parent.middle.data1 = parent.middle.data2;
                    parent.middle.data2 = undefined;
                } else {
                    parent.middle.data1 = parent.data2;
                    parent.data2 = undefined;
                    parent.middle.data2 = parent.right.data1;
                    parent.right = undefined;
                }
            } else {
                if (parent.middle.data2) {
                    parent.middle.data1 = parent.middle.data2;
                    parent.middle.data2 = undefined;
                }
            }
        } else if (parent.middle === node && parent.data2 && parent.right) {
            parent.middle.data1 = parent.data2;

            if (parent.right.data2) {
                parent.data2 = parent.right.data1;
                parent.right.data1 = parent.right.data2;
                parent.right.data2 = undefined;
            } else {
                parent.data2 = undefined;
                parent.middle.data2 = parent.right.data1;
                parent.right = undefined;
            }
        } else if (parent.right === node && parent.data2 && parent.middle) {
            if (parent.middle.data2) {
                parent.right.data1 = parent.data2;
                parent.data2 = parent.middle.data2;
                parent.middle.data2 = undefined;
            } else {
                parent.middle.data2 = parent.data2;
                parent.data2 = undefined;
                parent.right = undefined;
            }
        }
    }

    private findParent(current: TreeNode, child: TreeNode): TreeNode | null {
        if (current.left === child || current.middle === child || current.right === child) {
            return current;
        }

        if (current.left && child.data1.key < current.data1.key) {
            return this.findParent(current.left, child);
        } else if (current.middle && (!current.data2 || child.data1.key < current.data2.key)) {
            return this.findParent(current.middle, child);
        } else if (current.right) {
            return this.findParent(current.right, child);
        }

        return null;
    }

        *[Symbol.iterator](): Iterator<Alumno> {
            yield* this.inOrderTraversal(this.root);
        }
    
        private *inOrderTraversal(node: TreeNode | null): Generator<Alumno> {
            if (!node) return;
    
            if (node.left) {
                yield* this.inOrderTraversal(node.left);
            }
    
            yield node.data1.payload;
    
            if (node.middle) {
                yield* this.inOrderTraversal(node.middle);
            }
    
            if (node.data2) {
                yield node.data2.payload;
            }
    
            if (node.right) {
                yield* this.inOrderTraversal(node.right);
            }
        }
}
