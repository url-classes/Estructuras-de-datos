// TreeNode.ts
class TreeNode<T> {
    public data: T;
    public left: TreeNode<T> | null;
    public right: TreeNode<T> | null;
  
    constructor(data: T) {
      this.data = data;
      this.left = null;
      this.right = null;
    }
  
    public isLeaf(): boolean {
      return this.left === null && this.right === null;
    }
}
  
export default TreeNode;
